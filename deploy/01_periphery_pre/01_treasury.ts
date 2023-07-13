import { ZERO_ADDRESS } from '../../helpers/constants';
import { TREASURY_CONTROLLER_ID, TREASURY_IMPL_ID } from '../../helpers/deploy-ids';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import { TREASURY_PROXY_ID } from '../../helpers/deploy-ids';
import {
  ConfigNames,
  InitializableAdminUpgradeabilityProxy,
  eNetwork,
  getProxyAdminAddress,
  loadPoolConfig,
  waitForTx,
} from '../../helpers';
import { HopeLendEcosystemReserve } from '../../typechain';

/**
 * @notice A treasury proxy can be deployed per network or per market.
 * You need to take care to upgrade this proxy to the desired implementation.
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer, treasuryAdmin } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  // Deploy Treasury proxy
  const treasuryProxyArtifact = await deploy(TREASURY_PROXY_ID, {
    from: deployer,
    contract: 'InitializableAdminUpgradeabilityProxy',
    args: [],
  });

  // Deploy Treasury Controller
  const treasuryController = await deploy(TREASURY_CONTROLLER_ID, {
    from: deployer,
    contract: 'HopeLendEcosystemReserveController',
    args: [treasuryAdmin],
    ...COMMON_DEPLOY_PARAMS,
  });
  // Deploy Treasury implementation and initialize proxy
  const treasuryImplArtifact = await deploy(TREASURY_IMPL_ID, {
    from: deployer,
    contract: 'HopeLendEcosystemReserve',
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  const treasuryImpl = (await hre.ethers.getContractAt(
    treasuryImplArtifact.abi,
    treasuryImplArtifact.address
  )) as HopeLendEcosystemReserve;

  // Call to initialize at implementation contract to prevent other calls.
  await waitForTx(await treasuryImpl.initialize(ZERO_ADDRESS));

  // Initialize proxy
  const proxy = (await hre.ethers.getContractAt(
    treasuryProxyArtifact.abi,
    treasuryProxyArtifact.address
  )) as InitializableAdminUpgradeabilityProxy;

  const initializePayload = treasuryImpl.interface.encodeFunctionData('initialize', [
    treasuryController.address,
  ]);

  const proxyAdminAddress = await getProxyAdminAddress(poolConfig, network);
  await waitForTx(
    await proxy['initialize(address,address,bytes)'](
      treasuryImplArtifact.address,
      proxyAdminAddress,
      initializePayload
    )
  );

  return true;
};

func.tags = ['periphery-pre', 'TreasuryProxy'];
func.dependencies = [];
func.id = 'Treasury';

export default func;
