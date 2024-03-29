import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import { chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy } from '../../helpers/constants';
import {
  ConfigNames,
  TESTNET_PRICE_AGGR_PREFIX,
  eNetwork,
  isProductionMarket,
  loadPoolConfig,
} from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  if (!isProductionMarket(poolConfig) && !chainlinkAggregatorProxy[network]) {
    console.log(
      '[Deployments] Use the deployed data source in the deployments as the UiPoolDataProvider contract data source'
    );
    const AGGREGATOR_ID = `WETH${TESTNET_PRICE_AGGR_PREFIX}`;
    const aggregatorAddress = (await deployments.get(AGGREGATOR_ID)).address;
    await deploy('UiPoolDataProvider', {
      from: deployer,
      args: [aggregatorAddress, aggregatorAddress],
      ...COMMON_DEPLOY_PARAMS,
    });
    return;
  }

  if (!chainlinkAggregatorProxy[network]) {
    console.log(
      '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
    );
    return;
  }

  // Deploy UiPoolDataProvider getter helper
  await deploy('UiPoolDataProvider', {
    from: deployer,
    args: [chainlinkAggregatorProxy[network], chainlinkEthUsdAggregatorProxy[network]],
    ...COMMON_DEPLOY_PARAMS,
  });
};

func.tags = ['periphery-post', 'ui-helpers'];

export default func;
