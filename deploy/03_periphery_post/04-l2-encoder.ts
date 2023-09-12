import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import { chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy } from '../../helpers/constants';
import {
  ConfigNames,
  L2_ENCODER,
  POOL_PROXY_ID,
  TESTNET_PRICE_AGGR_PREFIX,
  eNetwork,
  isL2PoolSupported,
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

  const { address: poolProxyAddress } = await deployments.get(POOL_PROXY_ID);

  if (isL2PoolSupported(poolConfig)) {
    // Deploy L2 Encoder
    await deploy(L2_ENCODER, {
      from: deployer,
      contract: 'L2Encoder',
      args: [poolProxyAddress],
      ...COMMON_DEPLOY_PARAMS,
    });
  }
  return true;
};

func.id = `L2Encoder`;
func.tags = ['periphery-post', 'ui-helpers'];

export default func;
