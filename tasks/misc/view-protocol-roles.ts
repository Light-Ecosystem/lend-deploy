import { ZERO_ADDRESS } from './../../helpers/constants';
import { FORK } from '../../helpers/hardhat-config-helpers';
import {
  TREASURY_PROXY_ID,
  TREASURY_CONTROLLER_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  PROXY_ADMIN_ID,
} from '../../helpers/deploy-ids';
import {
  InitializableAdminUpgradeabilityProxy,
  WrappedTokenGateway,
  WrappedTokenGateway__factory,
} from '../../typechain';
import {
  getACLManager,
  getGaugeFactory,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getReservesSetupHelper,
  getWrappedTokenGateway,
} from '../../helpers/contract-getters';
import { task } from 'hardhat/config';
import { getAddressFromJson, getProxyAdminBySlot } from '../../helpers/utilities/tx';
import { exit } from 'process';
import {
  GOVERNANCE_BRIDGE_EXECUTOR,
  MULTISIG_ADDRESS,
  MULTISIG_POOL_ADMIN_ADDRESS,
  MULTISIG_ACL_ADMIN_ADDRESS,
} from '../../helpers/constants';
import {
  ConfigNames,
  eNetwork,
  getFirstSigner,
  getProxyAdminAddress,
  loadPoolConfig,
} from '../../helpers';
import { MARKET_NAME } from '../../helpers/env';

task(`view-protocol-roles`, `View current admin of each role and contract`).setAction(
  async (_, hre) => {
    const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
    const network = hre.network.name as eNetwork;
    // Deployer admins
    const {
      poolAdmin,
      aclAdmin,
      emergencyAdmin,
      assetListingAdmin,
      riskAdmin,
      deployer,
      treasuryAdmin,
      operator,
      gatewayOwner,
      flashBorrower,
    } = await hre.getNamedAccounts();

    const deployerSigner = await hre.ethers.getSigner(deployer);
    const aclSigner = await hre.ethers.getSigner(aclAdmin);
    const networkId = FORK ? FORK : hre.network.name;
    // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
    const desiredMultisig = networkId.includes('polygon')
      ? GOVERNANCE_BRIDGE_EXECUTOR[networkId]
      : MULTISIG_ADDRESS[networkId];
    const desiredPoolAdminMultisig = MULTISIG_POOL_ADMIN_ADDRESS[networkId];
    const desiredACLAdminMultisig = MULTISIG_ACL_ADMIN_ADDRESS[networkId];
    if (!desiredMultisig) {
      console.error(
        'The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant'
      );
      exit(403);
    }

    const poolAddressesProvider = await getPoolAddressesProvider();
    const proxyAdminAddress = await getProxyAdminAddress(poolConfig, network);

    console.log('--- Current deployer addresses ---');
    console.table({
      poolAdmin,
      aclAdmin,
      deployer,
      emergencyAdmin,
      treasuryAdmin,
      operator,
      gatewayOwner,
      flashBorrower,
    });
    console.log('--- Multisig and expected contract addresses ---');
    console.table({
      multisigOwner: desiredMultisig,
      multisigPoolAdmin: desiredPoolAdminMultisig,
      multisigACLAdmin: desiredACLAdminMultisig,
      poolAddressesProvider: poolAddressesProvider.address,
    });

    const currentOwner = await poolAddressesProvider.owner();

    if (currentOwner !== poolAdmin) {
      console.log("- Accounts loaded doesn't match current Market owner", currentOwner);
      console.log(`  - Market owner loaded from account  :`, poolAdmin);
      console.log(`  - Market owner loaded from pool prov:`, currentOwner);
    }

    const poolAddressesProviderRegistry = await getPoolAddressesProviderRegistry();
    const gaugeFactory = await getGaugeFactory();
    const aclManager = (await getACLManager(await poolAddressesProvider.getACLManager())).connect(
      aclSigner
    );
    const treasuryProxy = await hre.ethers.getContractAt(
      'InitializableAdminUpgradeabilityProxy',
      (
        await hre.deployments.get(TREASURY_PROXY_ID)
      ).address,
      deployerSigner
    );
    const treasuryController = await hre.ethers.getContractAt(
      'HopeLendEcosystemReserveController',
      (
        await hre.deployments.get(TREASURY_CONTROLLER_ID)
      ).address,
      deployerSigner
    );
    let wrappedTokenGateway: WrappedTokenGateway;
    try {
      wrappedTokenGateway = await getWrappedTokenGateway();
    } catch (err) {
      // load legacy contract of WrappedTokenGateway
      wrappedTokenGateway = WrappedTokenGateway__factory.connect(
        await getAddressFromJson(networkId, 'WrappedTokenGateway'),
        await getFirstSigner()
      );
    }

    const reservesSetupHelper = await getReservesSetupHelper();

    /** Output of results*/
    const result = [
      {
        role: 'PoolAddressesProvider owner',
        address: await poolAddressesProvider.owner(),
        assert: (await poolAddressesProvider.owner()) === desiredMultisig,
      },
      {
        role: 'PoolAddressesProviderRegistry owner',
        address: await poolAddressesProviderRegistry.owner(),
        assert: (await poolAddressesProviderRegistry.owner()) === desiredMultisig,
      },
      {
        role: 'WrappedTokenGateway owner',
        address: await wrappedTokenGateway.owner(),
        assert: (await wrappedTokenGateway.owner()) === desiredMultisig,
      },
      {
        role: 'ReservesSetupHelper owner',
        address: await reservesSetupHelper.owner(),
        assert: (await reservesSetupHelper.owner()) === desiredMultisig,
      },
      {
        role: 'Treasury Controller owner',
        address: await treasuryController.owner(),
        assert: (await treasuryController.owner()) === treasuryAdmin,
      },
      {
        role: 'AddressesProvider ACL Admin',
        address: await poolAddressesProvider.getACLAdmin(),
        assert: (await poolAddressesProvider.getACLAdmin()) === desiredACLAdminMultisig,
      },
      {
        role: 'ACL Manager Default Admin role granted Multisig',
        address: (await aclManager.hasRole(hre.ethers.constants.HashZero, desiredACLAdminMultisig))
          ? desiredACLAdminMultisig
          : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
          ? deployer
          : 'UNKNOWN',
        assert: await aclManager.hasRole(hre.ethers.constants.HashZero, desiredACLAdminMultisig),
      },
      {
        role: 'ACL Manager  Default Admin role revoked Deployer',
        address: (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
          ? 'NOT REVOKED'
          : 'REVOKED',
        assert: !(await aclManager.hasRole(hre.ethers.constants.HashZero, deployer)),
      },
      {
        role: 'FlashBorrower is contract',
        address: (await aclManager.isFlashBorrower(flashBorrower)) ? flashBorrower : ZERO_ADDRESS,
        assert: await aclManager.isFlashBorrower(flashBorrower),
      },
      {
        role: 'PoolAdmin is multisig',
        address: (await aclManager.isPoolAdmin(desiredPoolAdminMultisig))
          ? desiredPoolAdminMultisig
          : ZERO_ADDRESS,
        assert: await aclManager.isPoolAdmin(desiredPoolAdminMultisig),
      },
      {
        role: 'Deployer revoked PoolAdmin',
        address: (await aclManager.isPoolAdmin(deployer)) ? 'NOT REVOKED' : 'REVOKED',
        assert: !(await aclManager.isPoolAdmin(deployer)),
      },
      {
        role: 'EmergencyAdmin',
        address: (await aclManager.isEmergencyAdmin(emergencyAdmin))
          ? emergencyAdmin
          : ZERO_ADDRESS,
        assert: await aclManager.isEmergencyAdmin(emergencyAdmin),
      },
      {
        role: 'AssetListAdmin',
        address: (await aclManager.isAssetListingAdmin(assetListingAdmin))
          ? assetListingAdmin
          : 'DISABLED',
        assert: await aclManager.isAssetListingAdmin(assetListingAdmin),
      },
      {
        role: 'RiskAdmin',
        address: (await aclManager.isRiskAdmin(riskAdmin)) ? riskAdmin : 'DISABLED',
        assert: await aclManager.isRiskAdmin(riskAdmin),
      },
      {
        role: 'Treasury Proxy Admin',
        address: await getProxyAdminBySlot(treasuryProxy.address),
        assert: (await getProxyAdminBySlot(treasuryProxy.address)) === proxyAdminAddress,
      },
      {
        role: 'GaugeFactory operator',
        address: (await gaugeFactory.isOperator(operator)) ? operator : ZERO_ADDRESS,
        assert: await gaugeFactory.isOperator(operator),
      },
    ];

    console.table(result);

    return;
  }
);
