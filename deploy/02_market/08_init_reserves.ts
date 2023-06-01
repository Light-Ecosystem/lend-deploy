import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CORE_VERSION, ZERO_ADDRESS } from '../../helpers/constants';
import {
  checkRequiredEnvironment,
  ConfigNames,
  getParamPerNetwork,
  getReserveAddresses,
  getTreasuryAddress,
  loadPoolConfig,
  savePoolTokens,
} from '../../helpers/market-config-helpers';
import { eNetwork, IHopeLendConfiguration, ITokenAddress } from '../../helpers/types';
import { configureReservesByHelper, initReservesByHelper } from '../../helpers/init-helpers';
import { HOPE_ID, POOL_DATA_PROVIDER, STAKING_HOPE_ID } from '../../helpers/deploy-ids';
import { MARKET_NAME } from '../../helpers/env';
import { getAddress } from 'ethers/lib/utils';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  const { deployer } = await getNamedAccounts();

  const poolConfig = (await loadPoolConfig(MARKET_NAME as ConfigNames)) as IHopeLendConfiguration;

  const {
    HTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReservesConfig,
  } = poolConfig;

  const reservesAddresses = await getReserveAddresses(poolConfig, network);
  const treasuryAddress = await getTreasuryAddress(poolConfig, network);

  // Deploy Reserves HTokens
  await initReservesByHelper(
    ReservesConfig,
    reservesAddresses,
    HTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    deployer,
    treasuryAddress
  );
  deployments.log(`[Deployment] Initialized all reserves`);

  await configureReservesByHelper(ReservesConfig, reservesAddresses);

  // Save HToken and Debt tokens artifacts
  const dataProvider = await deployments.get(POOL_DATA_PROVIDER);
  await savePoolTokens(reservesAddresses, dataProvider.address);

  deployments.log(`[Deployment] Configured all reserves`);
  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ReservesInit:${MARKET_NAME}:lend-core@${CORE_VERSION}`;

func.tags = ['market', 'init-reserves'];
func.dependencies = ['before-deploy', 'core', 'periphery-pre', 'provider', 'init-pool', 'oracles'];

func.skip = async () => checkRequiredEnvironment();

export default func;
