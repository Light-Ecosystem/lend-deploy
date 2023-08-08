import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../../helpers/env';
import {
  checkRequiredEnvironment,
  ConfigNames,
  getRequiredParamPerNetwork,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
} from '../../../helpers/market-config-helpers';
import { eNetwork, ITokenAddress } from '../../../helpers/types';
import { TESTNET_PRICE_AGGR_PREFIX } from '../../../helpers/deploy-ids';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, CORE_VERSION } from '../../../helpers/constants';
import Bluebird from 'bluebird';
import { MARKET_NAME } from '../../../helpers/env';
import MockAggregatorABI from '../../../abi/MockAggregator.json';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy, save } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  if (isProductionMarket(poolConfig)) {
    console.log('[NOTICE] Skipping deployment of testnet price aggregators');
    return true;
  }

  const reserves = await getReserveAddresses(poolConfig, network);

  let symbols = Object.keys(reserves);

  // Iterate each token symbol and deploy a mock aggregator
  await Bluebird.each(symbols, async (symbol) => {
    let price = MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
    if (!price) {
      throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
    }
    await deploy(`${symbol}${TESTNET_PRICE_AGGR_PREFIX}`, {
      args: [price],
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
      contract: 'MockAggregator',
    });
  });

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `MockPriceAggregators:${MARKET_NAME}:@hopelend/core@${CORE_VERSION}`;

func.tags = ['market', 'init-testnet', 'price-aggregators-setup'];

func.dependencies = ['before-deploy', 'tokens-setup', 'periphery-pre'];

func.skip = async () => checkRequiredEnvironment();

export default func;
