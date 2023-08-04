import { FALLBACK_ORACLE_ID, ORACLE_ID, TESTNET_TOKEN_PREFIX } from '../../helpers/deploy-ids';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { MOCK_CHAINLINK_AGGREGATORS_PRICES, CORE_VERSION } from '../../helpers/constants';
import { getContract, waitForTx } from '../../helpers/utilities/tx';
import { HopeOracle, PoolAddressesProvider, PriceOracle__factory } from '../../typechain';
import { POOL_ADDRESSES_PROVIDER_ID } from '../../helpers/deploy-ids';
import { getAddress } from '@ethersproject/address';
import {
  checkRequiredEnvironment,
  ConfigNames,
  getChainlinkOracles,
  getFallbackOracleAddress,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
} from '../../helpers/market-config-helpers';
import { eEthereumNetwork, eNetwork } from '../../helpers/types';
import Bluebird from 'bluebird';
import { MARKET_NAME } from '../../helpers/env';
import { getPairsTokenAggregator } from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  const addressesProviderArtifact = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);
  const addressesProviderInstance = (await hre.ethers.getContractAt(
    addressesProviderArtifact.abi,
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  // 1. Set price oracle
  const configPriceOracle = (await deployments.get(ORACLE_ID)).address;
  const statePriceOracle = await addressesProviderInstance.getPriceOracle();
  if (getAddress(configPriceOracle) === getAddress(statePriceOracle)) {
    console.log('[addresses-provider] Price oracle already set. Skipping tx.');
  } else {
    await waitForTx(await addressesProviderInstance.setPriceOracle(configPriceOracle));
    console.log(`[Deployment] Added PriceOracle ${configPriceOracle} to PoolAddressesProvider`);
  }

  const hopeOracle = (await getContract(
    'HopeOracle',
    await addressesProviderInstance.getPriceOracle()
  )) as HopeOracle;

  // 2. Set AssetSources
  console.log(`[Deployment] Waiting for new blocks to be generated...`);
  await new Promise((res) => setTimeout(() => res(null), 15000));
  const reserveAssets = await getReserveAddresses(poolConfig, network);
  const chainlinkAggregators = await getChainlinkOracles(poolConfig, network);
  const [assets, sources] = getPairsTokenAggregator(reserveAssets, chainlinkAggregators);
  await waitForTx(await hopeOracle.setAssetSources(assets, sources));
  console.log(`[Deployment] Added AssetSources to HopeOracle`);

  // 3. Set fallback oracle
  const configFallbackOracle = await getFallbackOracleAddress(poolConfig, network);
  const stateFallbackOracle = await hopeOracle.getFallbackOracle();
  if (getAddress(configFallbackOracle) === getAddress(stateFallbackOracle)) {
    console.log('[hope-oracle] Fallback oracle already set. Skipping tx.');
  } else {
    await waitForTx(await hopeOracle.setFallbackOracle(configFallbackOracle));
    console.log(`[Deployment] Added Fallback oracle ${configPriceOracle} to HopeOracle`);
  }

  // 4. If testnet, setup fallback token prices
  if (isProductionMarket(poolConfig)) {
    console.log('[Deployment] Skipping testnet token prices setup');
    return true;
  }
  console.log('[Deployment] Setting up fallback oracle default prices for testnet environment');

  const reserves = await getReserveAddresses(poolConfig, network);

  const symbols = [...Object.keys(reserves)];

  const allTokens = {
    ...reserves,
  };

  // Iterate each token symbol and deploy a mock aggregator
  await Bluebird.each(symbols, async (symbol) => {
    const price = MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];

    if (!price) {
      throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
    }
    await waitForTx(
      await PriceOracle__factory.connect(
        configFallbackOracle,
        await hre.ethers.getSigner(deployer)
      ).setAssetPrice(allTokens[symbol], price)
    );
  });

  console.log('[Deployment] Fallback oracle asset prices updated');
  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `InitOracles:${MARKET_NAME}:lend-core@${CORE_VERSION}`;

func.tags = ['market', 'oracles'];

func.dependencies = ['before-deploy', 'core', 'periphery-pre', 'provider'];

func.skip = async () => checkRequiredEnvironment();

export default func;
