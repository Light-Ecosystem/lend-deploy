import { getPool } from '../../helpers/contract-getters';
import {
  ConfigNames,
  getParamPerNetwork,
  loadPoolConfig,
} from '../../helpers/market-config-helpers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import {
  BURNER_MANAGER_ID,
  UNDERLYING_BURNER_ID,
  MOCK_BURNER_MANAGER_ID,
  MOCK_UNDERLYING_BURNER_ID,
  MOCK_HOPE_SWARP_BURNER_ID,
} from '../../helpers/deploy-ids';
import { getContract, waitForTx } from '../../helpers/utilities/tx';
import { MARKET_NAME } from '../../helpers/env';
import { getHopeLendProtocolDataProvider } from '../../helpers/contract-getters';

import BurnerManagerArtifact from '../../extendedArtifacts/BurnerManager.json';
import UnderlyingBurnerArtifact from '../../extendedArtifacts/UnderlyingBurner.json';
import HopeSwapBurnerArtifact from '../../extendedArtifacts/HopeSwapBurner.json';
import { ZERO_ADDRESS, eNetwork } from '../../helpers';
import { getAddress } from 'ethers/lib/utils';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer, burnerOperatorRole } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const { BurnerManagerAddress, UnderlyingBurnerAddress } = poolConfig;
  const network = (process.env.FORK || hre.network.name) as eNetwork;
  const burnerManagerAddress = getParamPerNetwork(BurnerManagerAddress, network);

  if (burnerManagerAddress && getAddress(burnerManagerAddress) !== ZERO_ADDRESS) {
    const lendingFeeToVaultArtifact = await deploy('LendingFeeToVault', {
      from: deployer,
      args: [burnerManagerAddress, getParamPerNetwork(UnderlyingBurnerAddress, network)],
      ...COMMON_DEPLOY_PARAMS,
    });

    // Set feeToVault
    const pool = await getPool();
    await waitForTx(await pool.setFeeToVault(lendingFeeToVaultArtifact.address));
  } else {
    console.log('hardhat local network......................');
    // deploy mockBurnerManager
    const mockBurnerManagerArtifact = await deploy(MOCK_BURNER_MANAGER_ID, {
      contract: {
        abi: BurnerManagerArtifact.abi,
        bytecode: BurnerManagerArtifact.bytecode,
      },
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
    });

    console.log('BurnerManager', mockBurnerManagerArtifact.address);

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

    console.log('UnderlyingBurner', mockUnderlyingBurnerArtifact.address);

    // deploy lendingFeeToVault
    const lendingFeeToVaultArtifact = await deploy('LendingFeeToVault', {
      from: deployer,
      args: [mockBurnerManagerArtifact.address, mockUnderlyingBurnerArtifact.address],
      ...COMMON_DEPLOY_PARAMS,
    });

    console.log('lendingFeeToVault', lendingFeeToVaultArtifact.address);

    const hopeLendProtocolDataProviderInstance = await getHopeLendProtocolDataProvider();
    const allTokens = await hopeLendProtocolDataProviderInstance.getAllHTokens();
    const hopeAddress = allTokens.find((hToken) => hToken.symbol.includes('HOPE'))?.tokenAddress;

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

    console.log('HopeSwapBurner', mockHopeSwapBurnerArtifact.address);

    await waitForTx(
      await mockBurnerManagerInstance.setBurner(hopeAddress, mockHopeSwapBurnerArtifact.address)
    );

    // Set feeToVault
    const pool = await getPool();
    // await waitForTx(
    //   await pool.setFeeToVault(
    //     lendingFeeToVaultArtifact.address
    //   )
    // );

    const burner = await mockBurnerManagerInstance.burners(hopeAddress);
    console.log('---------------------', burner);
  }
};

export default func;
func.tags = ['lending-fee-to-vault'];
