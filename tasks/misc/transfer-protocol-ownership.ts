import { FORK } from './../../helpers/hardhat-config-helpers';
import { POOL_ADDRESSES_PROVIDER_ID } from './../../helpers/deploy-ids';
import {
  getACLManager,
  getGaugeFactory,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getTreasuryController,
  getWrappedTokenGateway,
} from './../../helpers/contract-getters';
import { task } from 'hardhat/config';
import { getAddressFromJson, waitForTx } from '../../helpers/utilities/tx';
import { exit } from 'process';
import {
  GOVERNANCE_BRIDGE_EXECUTOR,
  MULTISIG_ADDRESS,
  ZERO_ADDRESS,
} from '../../helpers/constants';

task(`transfer-protocol-ownership`, `Transfer the ownership of protocol from deployer`).setAction(
  async (_, hre) => {
    // Deployer admins
    const { poolAdmin, aclAdmin, deployer, emergencyAdmin, treasuryAdmin, operator } =
      await hre.getNamedAccounts();

    const networkId = FORK ? FORK : hre.network.name;
    // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
    const desiredMultisig = networkId.includes('polygon')
      ? GOVERNANCE_BRIDGE_EXECUTOR[networkId]
      : MULTISIG_ADDRESS[networkId];
    // Desired Emergency Admin at Polygon must be the multisig, not the crosschain executor
    if (!desiredMultisig) {
      console.error(
        'The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant'
      );
      exit(403);
    }

    console.log('--- CURRENT DEPLOYER ADDRESSES ---');
    console.table({
      poolAdmin,
      aclAdmin,
      deployer,
      emergencyAdmin,
      treasuryAdmin,
      operator,
    });
    console.log('--- DESIRED MULTISIG ADMIN ---');
    console.log(desiredMultisig);
    const aclSigner = await hre.ethers.getSigner(aclAdmin);

    const poolAddressesProvider = await getPoolAddressesProvider();
    const poolAddressesProviderRegistry = await getPoolAddressesProviderRegistry();
    const gaugeFactory = await getGaugeFactory();
    const wrappedGateway = await getWrappedTokenGateway();
    const treasuryController = await getTreasuryController();

    const aclManager = (await getACLManager(await poolAddressesProvider.getACLManager())).connect(
      aclSigner
    );

    const currentOwner = await poolAddressesProvider.owner();

    if (currentOwner === desiredMultisig) {
      console.log('- This market already transferred the ownership to desired multisig');
      exit(0);
    }
    if (currentOwner !== poolAdmin) {
      console.log("- Accounts loaded doesn't match current Market owner", currentOwner);
      console.log(`  - Market owner loaded from account  :`, poolAdmin);
      console.log(`  - Market owner loaded from pool prov:`, currentOwner);
      exit(403);
    }

    /** Start of Emergency Admin transfer */
    const isDeployerEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);
    if (isDeployerEmergencyAdmin) {
      await waitForTx(await aclManager.addEmergencyAdmin(desiredMultisig));

      await waitForTx(await aclManager.removeEmergencyAdmin(emergencyAdmin));
      console.log('- Transferred the ownership of Emergency Admin');
    }
    /** End of Emergency Admin transfer */

    /** Start of Pool Admin transfer */
    const isDeployerPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
    if (isDeployerPoolAdmin) {
      await waitForTx(await aclManager.addPoolAdmin(desiredMultisig));

      await waitForTx(await aclManager.removePoolAdmin(poolAdmin));
      console.log('- Transferred the ownership of Pool Admin');
    }
    /** End of Pool Admin transfer */

    /** Start of Pool Addresses Provider  Registry transfer ownership */
    const isDeployerACLAdminAtPoolAddressesProviderOwner =
      (await poolAddressesProvider.getACLAdmin()) === deployer;
    if (isDeployerACLAdminAtPoolAddressesProviderOwner) {
      await waitForTx(await poolAddressesProvider.setACLAdmin(desiredMultisig));
      console.log('- Transferred ACL Admin');
    }
    /** End of Pool Addresses Provider  Registry transfer ownership */

    /** Start of Pool Addresses Provider  Registry transfer ownership */
    const isDeployerPoolAddressesProviderRegistryOwner =
      (await poolAddressesProviderRegistry.owner()) === deployer;
    if (isDeployerPoolAddressesProviderRegistryOwner) {
      await waitForTx(await poolAddressesProviderRegistry.transferOwnership(desiredMultisig));
      console.log('- Transfering of Pool Addresses Provider Registry');
    }
    /** End of Pool Addresses Provider Registry transfer ownership */

    /** Start of Pool Addresses Provider transfer ownership */
    const isDeployerPoolAddressesProviderOwner = (await poolAddressesProvider.owner()) === deployer;
    if (isDeployerPoolAddressesProviderOwner) {
      await waitForTx(await poolAddressesProvider.transferOwnership(desiredMultisig));
      console.log('- Transfering of Pool Addresses Provider and Market ownership');
    }
    /** End of Pool Addresses Provider transfer ownership */

    /** Start of WrappedTokenGateway transfer ownership */
    const isDeployerGatewayOwner = (await wrappedGateway.owner()) === deployer;
    if (isDeployerGatewayOwner) {
      await waitForTx(await wrappedGateway.transferOwnership(desiredMultisig));
      console.log('- Transfering WrappedTokenGateway ownership');
    }
    /** End of WrappedTokenGateway ownership */

    /** Start of TreasuryController transfer ownership */
    const isDeployerTreasuryControllerOwner = (await treasuryController.owner()) === deployer;
    if (isDeployerTreasuryControllerOwner) {
      await waitForTx(await treasuryController.transferOwnership(treasuryAdmin));
      console.log('- Transfering WrappedTokenGateway ownership');
    }
    /** End of WrappedTokenGateway ownership */

    /** Start of DEFAULT_ADMIN_ROLE transfer ownership */
    const isDeployerDefaultAdmin = await aclManager.hasRole(
      hre.ethers.constants.HashZero,
      deployer
    );
    if (isDeployerDefaultAdmin) {
      console.log('- Transferring the DEFAULT_ADMIN_ROLE to the multisig address');
      await waitForTx(await aclManager.grantRole(hre.ethers.constants.HashZero, desiredMultisig));
      console.log('- Revoking deployer as DEFAULT_ADMIN_ROLE to the multisig address');
      await waitForTx(await aclManager.revokeRole(hre.ethers.constants.HashZero, deployer));
      console.log('- Revoked DEFAULT_ADMIN_ROLE to deployer ');
    }
    /** End of DEFAULT_ADMIN_ROLE transfer ownership */

    /** Start of grant operator to GaugeFactory */
    const isDeployerOperatorAtGaugeFactory = await gaugeFactory.isOperator(deployer);
    if (isDeployerOperatorAtGaugeFactory) {
      console.log('- Transferring the OPERATOR_ROLE to the operator address');
      await waitForTx(await gaugeFactory.addOperator(operator));
      console.log('- Revoking deployer as OPERATOR_ROLE to the operator address');
      await waitForTx(await gaugeFactory.removeOperator(deployer));
      console.log('- Revoked OPERATOR_ROLE to deployer');
    }
    /** End of grant operator to GaugeFactory */

    /** Output of results*/
    const result = [
      {
        role: 'PoolAdmin',
        address: (await aclManager.isPoolAdmin(desiredMultisig)) ? desiredMultisig : poolAdmin,
        assert: await aclManager.isPoolAdmin(desiredMultisig),
      },
      {
        role: 'PoolAddressesProvider owner',
        address: await poolAddressesProvider.owner(),
        pendingOwnerAddress: await poolAddressesProvider.pendingOwner(),
        assert: (await poolAddressesProvider.pendingOwner()) === desiredMultisig,
      },
      {
        role: 'PoolAddressesProviderRegistry owner',
        address: await poolAddressesProviderRegistry.owner(),
        pendingOwnerAddress: await poolAddressesProviderRegistry.pendingOwner(),
        assert: (await poolAddressesProviderRegistry.pendingOwner()) === desiredMultisig,
      },
      {
        role: 'GaugeFactory operator',
        address: (await gaugeFactory.isOperator(operator)) ? operator : ZERO_ADDRESS,
        assert: await gaugeFactory.isOperator(operator),
      },
      {
        role: 'WrappedTokenGateway owner',
        address: await wrappedGateway.owner(),
        pendingOwnerAddress: await wrappedGateway.pendingOwner(),
        assert: (await wrappedGateway.pendingOwner()) === desiredMultisig,
      },
      {
        role: 'TreasuryController owner',
        address: await treasuryController.owner(),
        pendingOwnerAddress: await treasuryController.pendingOwner(),
        assert: (await treasuryController.pendingOwner()) === treasuryAdmin,
      },
      {
        role: 'ACL Default Admin role revoked Deployer',
        address: (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
          ? 'NOT REVOKED'
          : 'REVOKED',
        assert: !(await aclManager.hasRole(hre.ethers.constants.HashZero, deployer)),
      },
      {
        role: 'ACL Default Admin role granted Multisig',
        address: (await aclManager.hasRole(hre.ethers.constants.HashZero, desiredMultisig))
          ? desiredMultisig
          : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
          ? deployer
          : 'UNKNOWN',
        assert: await aclManager.hasRole(hre.ethers.constants.HashZero, desiredMultisig),
      },
    ];

    console.table(result);

    return;
  }
);
