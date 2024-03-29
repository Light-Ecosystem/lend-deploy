import { getChainlinkOracles, isProductionMarket } from '../../helpers/market-config-helpers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import { CORE_VERSION, ZERO_ADDRESS } from '../../helpers/constants';
import {
  FALLBACK_ORACLE_ID,
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from '../../helpers/deploy-ids';
import {
  loadPoolConfig,
  ConfigNames,
  getParamPerNetwork,
  checkRequiredEnvironment,
  getReserveAddresses,
} from '../../helpers/market-config-helpers';
import { eEthereumNetwork, eNetwork, ICommonConfiguration, SymbolMap } from '../../helpers/types';
import { getPairsTokenAggregator } from '../../helpers/init-helpers';
import { parseUnits } from 'ethers/lib/utils';
import { MARKET_NAME } from '../../helpers/env';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  const { OracleQuoteUnit } = poolConfig as ICommonConfiguration;

  const { address: addressesProviderAddress } = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const fallbackOracleAddress =
    (await getParamPerNetwork(poolConfig.FallbackOracle, network)) || ZERO_ADDRESS;

  // Deploy HopeOracle
  await deploy(ORACLE_ID, {
    contract: 'HopeOracle',
    from: deployer,
    args: [
      addressesProviderAddress,
      [],
      [],
      fallbackOracleAddress,
      ZERO_ADDRESS,
      parseUnits('1', OracleQuoteUnit),
    ],
    ...COMMON_DEPLOY_PARAMS,
  });

  if (isProductionMarket(poolConfig)) {
    console.log('[Deployment] Skipping fallback oracle deploy at production market');
  } else {
    // Deploy FallbackOracle
    await deploy(FALLBACK_ORACLE_ID, {
      contract: 'PriceOracle',
      from: deployer,
      args: [],
      ...COMMON_DEPLOY_PARAMS,
    });
  }

  return true;
};

func.id = `Oracles:${MARKET_NAME}:@hopelend/core@${CORE_VERSION}`;

func.tags = ['market', 'oracle'];

func.dependencies = ['before-deploy'];

func.skip = async () => checkRequiredEnvironment();

export default func;
