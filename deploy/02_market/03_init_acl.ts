import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import { CORE_VERSION, ZERO_BYTES_32 } from '../../helpers/constants';
import { waitForTx } from '../../helpers/utilities/tx';
import { ACLManager, PoolAddressesProvider } from '../../typechain';
import { checkRequiredEnvironment } from '../../helpers/market-config-helpers';
import { ACL_MANAGER_ID, POOL_ADDRESSES_PROVIDER_ID } from '../../helpers/deploy-ids';
import { MARKET_NAME } from '../../helpers/env';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer, poolAdmin, aclAdmin, emergencyAdmin, assetListingAdmin, riskAdmin } =
    await getNamedAccounts();

  const aclAdminSigner = await hre.ethers.getSigner(aclAdmin);

  const addressesProviderArtifact = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const addressesProviderInstance = (await hre.ethers.getContractAt(
    addressesProviderArtifact.abi,
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  // 1. Set ACL admin at AddressesProvider
  await waitForTx(await addressesProviderInstance.setACLAdmin(aclAdmin));

  // 2. Deploy ACLManager and setup administrators
  const aclManagerArtifact = await deploy(ACL_MANAGER_ID, {
    from: deployer,
    contract: 'ACLManager',
    args: [addressesProviderArtifact.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  const aclManager = (await hre.ethers.getContractAt(
    aclManagerArtifact.abi,
    aclManagerArtifact.address
  )) as ACLManager;

  // 3. Setup ACLManager at AddressesProviderInstance
  await waitForTx(await addressesProviderInstance.setACLManager(aclManager.address));

  // 4. Add PoolAdmin to ACLManager contract
  await waitForTx(await aclManager.connect(aclAdminSigner).addPoolAdmin(poolAdmin));

  // 5. Add EmergencyAdmin to ACLManager contract
  await waitForTx(await aclManager.connect(aclAdminSigner).addEmergencyAdmin(emergencyAdmin));

  // 6. Add AssetListingAdmin to ACLManager contract
  await waitForTx(await aclManager.connect(aclAdminSigner).addAssetListingAdmin(assetListingAdmin));

  // 7. Add RiskAdmin to ACLManager contract
  await waitForTx(await aclManager.connect(aclAdminSigner).addRiskAdmin(riskAdmin));

  const isACLAdmin = await aclManager.hasRole(ZERO_BYTES_32, aclAdmin);
  const isPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
  const isEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);
  const isAssetListingAdmin = await aclManager.isAssetListingAdmin(assetListingAdmin);
  const isRiskAdmin = await aclManager.isRiskAdmin(riskAdmin);

  if (!isACLAdmin) throw '[ACL][ERROR] ACLAdmin is not setup correctly';
  if (!isPoolAdmin) throw '[ACL][ERROR] PoolAdmin is not setup correctly';
  if (!isEmergencyAdmin) throw '[ACL][ERROR] EmergencyAdmin is not setup correctly';
  if (!isAssetListingAdmin) throw '[ACL][ERROR] AssetListingAdmin is not setup correctly';
  if (!isRiskAdmin) throw '[ACL][ERROR] RiskAdmin is not setup correctly';
  console.log('== Market Admins ==');
  console.log('- ACL Admin', aclAdmin);
  console.log('- Pool Admin', poolAdmin);
  console.log('- Emergency Admin', emergencyAdmin);
  console.log('- AssetListing Admin', assetListingAdmin);
  console.log('- RiskAdmin Admin', riskAdmin);

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ACLManager:${MARKET_NAME}:lend-core@${CORE_VERSION}`;

func.tags = ['market', 'acl'];

func.dependencies = ['before-deploy', 'core', 'periphery-pre', 'provider'];

func.skip = async () => checkRequiredEnvironment();

export default func;
