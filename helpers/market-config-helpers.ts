import { getAddress } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import Bluebird from 'bluebird';
import {
  iParamsPerNetwork,
  eNetwork,
  PoolConfiguration,
  IBaseConfiguration,
  ITokenAddress,
  tEthereumAddress,
  ICommonConfiguration,
  SubTokenOutput,
  AssetType,
  eEthereumNetwork,
} from './types';
import HopeLendMarket from '../markets/hopeLend';
import HopeLendTestMarket from '../markets/test';
import HarmonyMarket from '../markets/harmony';
import AvalancheMarket from '../markets/avalanche';
import FantomMarket from '../markets/fantom';
import PolygonMarket from '../markets/polygon';
import OptimisticConfig from '../markets/optimistic';
import ArbitrumConfig from '../markets/arbitrum';
import { isValidAddress } from './utilities/utils';
import { GaugeFactory, HopeLendProtocolDataProvider } from '../typechain';
import {
  HTOKEN_PREFIX,
  STABLE_DEBT_PREFIX,
  TESTNET_PRICE_AGGR_PREFIX,
  TESTNET_TOKEN_PREFIX,
  TREASURY_PROXY_ID,
  VARIABLE_DEBT_PREFIX,
  STAKING_HOPE_ID,
  GAUGE_CONTROLLER_ID,
  GAUGE_FACTORY_ID,
  FEE_TO_VAULT_ID,
  VOTING_ESCROW_ID,
  MINTER_ID,
  PROXY_ADMIN_ID,
  FALLBACK_ORACLE_ID,
} from './deploy-ids';
import { ZERO_ADDRESS } from './constants';
import { getTestnetReserveAddressFromSymbol, POOL_DATA_PROVIDER } from '.';
import { MARKET_NAME } from './env';
import BaseConfig from '../markets/base';

declare var hre: HardhatRuntimeEnvironment;

export enum ConfigNames {
  Commons = 'Commons',
  HopeLend = 'HopeLend',
  Test = 'Test',
  Harmony = 'Harmony',
  Avalanche = 'Avalanche',
  Fantom = 'Fantom',
  Polygon = 'Polygon',
  Optimistic = 'Optimistic',
  Arbitrum = 'Arbitrum',
  Base = 'Base',
}

export const getParamPerNetwork = <T>(
  param: iParamsPerNetwork<T> | undefined,
  network: eNetwork
): T | undefined => {
  if (!param) return undefined;

  return param[network];
};

export const getRequiredParamPerNetwork = <T>(
  poolConfig: PoolConfiguration,
  key: keyof PoolConfiguration,
  network: eNetwork
): T => {
  const mapNetworkToValue = poolConfig[key] as iParamsPerNetwork<T>;
  if (!mapNetworkToValue) throw `[config] missing required parameter ${key} at market config`;

  const value = mapNetworkToValue[network];
  if (!value) throw `[config] missing required value at ${key}.${network}`;

  return value;
};

export const getAddressFromConfig = (
  param: iParamsPerNetwork<string | undefined>,
  network: eNetwork,
  key?: string
): tEthereumAddress => {
  const value = getParamPerNetwork<tEthereumAddress | undefined>(param, network);
  if (!value || !isValidAddress(value)) {
    throw Error(
      `[@hopelend/deploy] Input parameter ${key ? `"${key}"` : ''} is missing or is not an address.`
    );
  }
  return value;
};

export const loadPoolConfig = (configName: ConfigNames): PoolConfiguration => {
  switch (configName) {
    case ConfigNames.HopeLend:
      return HopeLendMarket;
    case ConfigNames.Test:
      return HopeLendTestMarket;
    case ConfigNames.Harmony:
      return HarmonyMarket;
    case ConfigNames.Avalanche:
      return AvalancheMarket;
    case ConfigNames.Fantom:
      return FantomMarket;
    case ConfigNames.Polygon:
      return PolygonMarket;
    case ConfigNames.Optimistic:
      return OptimisticConfig;
    case ConfigNames.Arbitrum:
      return ArbitrumConfig;
    case ConfigNames.Base:
      return BaseConfig;
    default:
      throw new Error(
        `Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(
          ConfigNames
        )}`
      );
  }
};

export const checkRequiredEnvironment = () => {
  if (!process.env.MARKET_NAME) {
    console.error(`Skipping Market deployment due missing "MARKET_NAME" environment variable.`);
    return true;
  }
  return false;
};

export const savePoolTokens = async (
  reservesConfig: ITokenAddress,
  dataProviderAddress: tEthereumAddress
) => {
  const dataProviderArtifact = await hre.deployments.get(POOL_DATA_PROVIDER);
  const dataProvider = (await hre.ethers.getContractAt(
    dataProviderArtifact.abi,
    dataProviderAddress
  )) as HopeLendProtocolDataProvider;

  const hTokenArtifact = await hre.deployments.getExtendedArtifact('HToken');
  const variableDebtTokenArtifact = await hre.deployments.getExtendedArtifact('VariableDebtToken');
  const stableDebtTokenArtifact = await hre.deployments.getExtendedArtifact('StableDebtToken');
  return Bluebird.each(Object.keys(reservesConfig), async (tokenSymbol) => {
    const { hTokenAddress, variableDebtTokenAddress, stableDebtTokenAddress } =
      await dataProvider.getReserveTokensAddresses(reservesConfig[tokenSymbol]);

    await hre.deployments.save(`${tokenSymbol}${HTOKEN_PREFIX}`, {
      address: hTokenAddress,
      ...hTokenArtifact,
    });
    await hre.deployments.save(`${tokenSymbol}${VARIABLE_DEBT_PREFIX}`, {
      address: variableDebtTokenAddress,
      ...variableDebtTokenArtifact,
    });
    await hre.deployments.save(`${tokenSymbol}${STABLE_DEBT_PREFIX}`, {
      address: stableDebtTokenAddress,
      ...stableDebtTokenArtifact,
    });
  });
};

export const getReserveAddresses = async (poolConfig: IBaseConfiguration, network: eNetwork) => {
  const isLive = hre.config.networks[network].live;

  if (isLive && !poolConfig.TestnetMarket) {
    console.log('[NOTICE] Using ReserveAssets from configuration file');

    return getRequiredParamPerNetwork<ITokenAddress>(poolConfig, 'ReserveAssets', network);
  }
  console.log(
    '[WARNING] Using deployed Testnet tokens instead of ReserveAssets from configuration file'
  );
  const reservesKeys = Object.keys(poolConfig.ReservesConfig);
  const allDeployments = await hre.deployments.all();
  let testnetTokenKeys = Object.keys(allDeployments).filter(
    (key) =>
      key.includes(TESTNET_TOKEN_PREFIX) &&
      reservesKeys.includes(key.replace(TESTNET_TOKEN_PREFIX, ''))
  );
  return testnetTokenKeys.reduce<ITokenAddress>((acc, key) => {
    const symbol = key.replace(TESTNET_TOKEN_PREFIX, '');
    acc[symbol] = allDeployments[key].address;
    return acc;
  }, {});
};

export const getSubTokensByPrefix = async (prefix: string): Promise<SubTokenOutput[]> => {
  const allDeployments = await hre.deployments.all();
  const tokenKeys = Object.keys(allDeployments).filter((key) => key.includes(prefix));

  if (!tokenKeys.length) {
    return [];
  }

  return tokenKeys.reduce<SubTokenOutput[]>((acc, key) => {
    acc.push({
      symbol: key.replace(prefix, ''),
      artifact: allDeployments[key],
    });
    return acc;
  }, []);
};

export const getSymbolsByPrefix = async (prefix: string): Promise<string[]> => {
  const allDeployments = await hre.deployments.all();
  const tokenKeys = Object.keys(allDeployments).filter((key) => key.includes(prefix));

  if (!tokenKeys.length) {
    return [];
  }

  return tokenKeys.reduce<string[]>((acc, key) => {
    acc.push(key.replace(prefix, ''));
    return acc;
  }, []);
};

export const getChainlinkOracles = async (poolConfig: IBaseConfiguration, network: eNetwork) => {
  const isLive = hre.config.networks[network].live;
  if (isLive) {
    console.log('[NOTICE] Using ChainlinkAggregator from configuration file');

    return getRequiredParamPerNetwork<ITokenAddress>(poolConfig, 'ChainlinkAggregator', network);
  }
  console.log(
    '[WARNING] Using deployed Mock Price Aggregators instead of ChainlinkAggregator from configuration file'
  );

  const reservesKeys = Object.keys(poolConfig.ReservesConfig);
  const allDeployments = await hre.deployments.all();
  const testnetKeys = Object.keys(allDeployments).filter(
    (key) =>
      key.includes(TESTNET_PRICE_AGGR_PREFIX) &&
      reservesKeys.includes(key.replace(TESTNET_PRICE_AGGR_PREFIX, ''))
  );
  return testnetKeys.reduce<ITokenAddress>((acc, key) => {
    const symbol = key.replace(TESTNET_PRICE_AGGR_PREFIX, '');
    acc[symbol] = allDeployments[key].address;
    return acc;
  }, {});
};

export const getTreasuryAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const treasuryConfigAddress = getParamPerNetwork<string>(
    poolConfig.ReserveFactorTreasuryAddress,
    network
  );

  if (treasuryConfigAddress && getAddress(treasuryConfigAddress) !== getAddress(ZERO_ADDRESS)) {
    return treasuryConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed Treasury proxy instead of ReserveFactorTreasuryAddress from configuration file'
  );

  const deployedTreasury = await hre.deployments.get(TREASURY_PROXY_ID);

  return deployedTreasury.address;
};

export const getFeeToVaultAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const feeToVaultConfigAddress = getParamPerNetwork<string>(poolConfig.FeeToVaultAddress, network);

  if (feeToVaultConfigAddress && getAddress(feeToVaultConfigAddress) !== getAddress(ZERO_ADDRESS)) {
    return feeToVaultConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed FeeToVault proxy instead of FeeToVaultAddress from configuration file'
  );

  const deployedFeeToVault = await hre.deployments.get(FEE_TO_VAULT_ID);

  return deployedFeeToVault.address;
};

export const getVotingEscrowAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const votingEscrowConfigAddress = getParamPerNetwork<string>(
    poolConfig.VotingEscrowAddress,
    network
  );

  if (
    votingEscrowConfigAddress &&
    getAddress(votingEscrowConfigAddress) !== getAddress(ZERO_ADDRESS)
  ) {
    return votingEscrowConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed VotingEscrow instead of VotingEscrowAddress from configuration file'
  );

  const deployedVotingEscrow = await hre.deployments.get(VOTING_ESCROW_ID);

  return deployedVotingEscrow.address;
};

export const getMinterAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const minterConfigAddress = getParamPerNetwork<string>(poolConfig.MinterAddress, network);

  if (minterConfigAddress && getAddress(minterConfigAddress) !== getAddress(ZERO_ADDRESS)) {
    return minterConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed Minter instead of MinterAddress from configuration file'
  );

  const deployedMinter = await hre.deployments.get(MINTER_ID);

  return deployedMinter.address;
};

export const getProxyAdminAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const proxyAdminConfigAddress = getParamPerNetwork<string>(poolConfig.ProxyAdminAddress, network);

  if (proxyAdminConfigAddress && getAddress(proxyAdminConfigAddress) !== getAddress(ZERO_ADDRESS)) {
    return proxyAdminConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed ProxyAdmin instead of ProxyAdminAddress from configuration file'
  );

  const deployedProxyAdmin = await hre.deployments.get(PROXY_ADMIN_ID);

  return deployedProxyAdmin.address;
};

export const getFallbackOracleAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const fallbackOracleConfigAddress = getParamPerNetwork<string>(
    poolConfig.FallbackOracle,
    network
  );

  if (fallbackOracleConfigAddress) {
    return fallbackOracleConfigAddress;
  }

  console.log(
    '[WARNING] Using latest deployed FallbackOracle instead of FallbackOracle from configuration file'
  );

  const deployedFallbackOracle = await hre.deployments.get(FALLBACK_ORACLE_ID);

  return deployedFallbackOracle.address;
};

export const getSequencerOracleAddress = async (
  poolConfig: IBaseConfiguration,
  network: eNetwork
): Promise<tEthereumAddress> => {
  const sequencerOracleConfigAddress = getParamPerNetwork<string>(
    poolConfig.SequencerOracle,
    network
  );

  if (sequencerOracleConfigAddress) {
    return sequencerOracleConfigAddress;
  }

  return '';
};

export const isProductionMarket = (poolConfig: ICommonConfiguration): boolean => {
  let network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  return hre.config.networks[network]?.live && !poolConfig.TestnetMarket;
};

export const isTestnetMarket = (poolConfig: ICommonConfiguration): boolean =>
  !isProductionMarket(poolConfig);

export const isUnitTestEnv = (): boolean => {
  let network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  return network === eEthereumNetwork.hardhat && MARKET_NAME === ConfigNames.Test;
};

export const getReserveAddress = async (poolConfig: ICommonConfiguration, symbol: string) => {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  let assetAddress = poolConfig.ReserveAssets?.[network]?.[symbol];

  const isZeroOrNull = !assetAddress || assetAddress === ZERO_ADDRESS;

  if (isZeroOrNull && isTestnetMarket(poolConfig)) {
    return await getTestnetReserveAddressFromSymbol(symbol);
  }

  if (!assetAddress || isZeroOrNull) {
    throw `Missing asset address for asset ${symbol}`;
  }

  return assetAddress;
};

export const getOracleByAsset = async (poolConfig: ICommonConfiguration, symbol: string) => {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  if (isTestnetMarket(poolConfig)) {
    return (await hre.deployments.get(`${symbol}${TESTNET_PRICE_AGGR_PREFIX}`)).address;
  }
  const oracleAddress = poolConfig.ChainlinkAggregator[network]?.[symbol];

  if (!oracleAddress) {
    throw `Missing oracle address for ${symbol}`;
  }

  return oracleAddress;
};

export const isL2PoolSupported = (poolConfig: ICommonConfiguration) => {
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  return !!getParamPerNetwork<boolean>(poolConfig.L2PoolEnabled, network);
};

export const getPrefixByAssetType = (assetType: AssetType) => {
  switch (assetType) {
    case AssetType.HToken:
      return HTOKEN_PREFIX;
    case AssetType.VariableDebtToken:
      return VARIABLE_DEBT_PREFIX;
    case AssetType.StableDebtToken:
      return STABLE_DEBT_PREFIX;
  }
};
