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
import { POOL_ADDRESSES_PROVIDER_ID, POOL_DATA_PROVIDER } from '../../helpers/deploy-ids';
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

  const addressProviderArtifact = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const {
    HTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReservesConfig,
    RateStrategies,
  } = poolConfig;

  // Deploy Rate Strategies
  for (const strategy in RateStrategies) {
    const strategyData = RateStrategies[strategy];
    const args = [
      addressProviderArtifact.address,
      strategyData.optimalUsageRatio,
      strategyData.baseVariableBorrowRate,
      strategyData.variableRateSlope1,
      strategyData.variableRateSlope2,
      strategyData.stableRateSlope1,
      strategyData.stableRateSlope2,
      strategyData.baseStableRateOffset,
      strategyData.stableRateExcessOffset,
      strategyData.optimalStableToTotalDebtRatio,
    ];
    await deployments.deploy(`ReserveStrategy-${strategyData.name}`, {
      from: deployer,
      args: args,
      contract: 'DefaultReserveInterestRateStrategy',
      log: true,
    });
  }

  const reservesAddresses = await getReserveAddresses(poolConfig, network);
  const treasuryAddress = await getTreasuryAddress(poolConfig, network);

  if (Object.keys(reservesAddresses).length == 0) {
    console.warn('[WARNING] Skipping initialization. Empty asset list.');
    return;
  }

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
func.id = `ReservesInit:${MARKET_NAME}:@hopelend/core@${CORE_VERSION}`;

func.tags = ['market', 'init-reserves'];
func.dependencies = ['before-deploy', 'core', 'periphery-pre', 'provider', 'init-pool', 'oracles'];

func.skip = async () => checkRequiredEnvironment();

export default func;
