import { getPool } from '../../helpers/contract-getters';
import { ConfigNames, loadPoolConfig } from '../../helpers/market-config-helpers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import { isProductionMarket } from '../../helpers/market-config-helpers';
import {
  BURNER_MANAGER_ID,
  UNDERLYING_BURNER_ID,
  MOCK_BURNER_MANAGER_ID,
  MOCK_UNDERLYING_BURNER_ID,
  MOCK_HOPE_SWARP_BURNER_ID,
} from '../../helpers/deploy-ids';
import { waitForTx } from '../../helpers/utilities/tx';
import { MARKET_NAME } from '../../helpers/env';
import { getHopeLendProtocolDataProvider } from '../../helpers/contract-getters';

import BurnerManagerArtifact from '../../extendedArtifacts/BurnerManager.json';
import UnderlyingBurnerArtifact from '../../extendedArtifacts/UnderlyingBurner.json';
import HopeSwapBurnerArtifact from '../../extendedArtifacts/HopeSwapBurner.json';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  if (isProductionMarket(poolConfig)) {
    const burnerManager = (await deployments.get(BURNER_MANAGER_ID)).address;
    const underlyingBurner = (await deployments.get(UNDERLYING_BURNER_ID)).address;
    const lendingFeeToVaultArtifact = await deploy('LendingFeeToVault', {
      from: deployer,
      args: [burnerManager, underlyingBurner],
      ...COMMON_DEPLOY_PARAMS,
    });

    const lendingFeeToVaultInstance = (await hre.ethers.getContractAt(
      lendingFeeToVaultArtifact.abi,
      lendingFeeToVaultArtifact.address
    )) as any;

    // Set feeToVault
    const pool = await getPool();
    await waitForTx(await pool.setFeeToVault(lendingFeeToVaultArtifact.address));

    //keccak256("Operator_Role")
    const hashOfRole = "0xa33daac198390630db2998ca75f43ac7962e047fbef856c9c97ccc60c64bfe17";
    await waitForTx(await lendingFeeToVaultInstance.grantRole(hashOfRole, deployer));

  } else {
    // deploy mockBurnerManager
    const mockBurnerManagerArtifact = await deploy(MOCK_BURNER_MANAGER_ID, {
      contract: {
        abi: BurnerManagerArtifact.abi,
        bytecode: BurnerManagerArtifact.bytecode,
      },
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
    });

    const mockBurnerManagerInstance = (await hre.ethers.getContractAt(
      mockBurnerManagerArtifact.abi,
      mockBurnerManagerArtifact.address
    )) as any;

    // deploy mockUnderlyingBurner
    const mockUnderlyingBurnerArtifact = await deploy(MOCK_UNDERLYING_BURNER_ID, {
      contract: {
        abi: UnderlyingBurnerArtifact.abi,
        bytecode: UnderlyingBurnerArtifact.bytecode,
      },
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
    });

    // deploy lendingFeeToVault
    const lendingFeeToVaultArtifact = await deploy('LendingFeeToVault', {
      from: deployer,
      args: [mockBurnerManagerArtifact.address, mockUnderlyingBurnerArtifact.address],
      ...COMMON_DEPLOY_PARAMS,
    });

    const hopeLendProtocolDataProviderInstance = await getHopeLendProtocolDataProvider();
    const reservesTokens = await hopeLendProtocolDataProviderInstance.getAllReservesTokens();
    const hopeAddress = reservesTokens.find((token) => token.symbol === 'HOPE')?.tokenAddress;

    //deploy MockHopeSwapBurner
    const mockHopeSwapBurnerArtifact = await deploy(MOCK_HOPE_SWARP_BURNER_ID, {
      contract: {
        abi: HopeSwapBurnerArtifact.abi,
        bytecode: HopeSwapBurnerArtifact.bytecode,
      },
      args: [hopeAddress, lendingFeeToVaultArtifact.address],
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
    });

    await waitForTx(
      await mockBurnerManagerInstance.setBurner(hopeAddress, mockHopeSwapBurnerArtifact.address)
    );
  }
};

export default func;
func.tags = ['lending-fee-to-vault'];
