import {
  MockHopeLendEcosystemReserveV2,
  MockL2HToken,
  MockL2Pool,
  MockL2StableDebtToken,
  MockL2VariableDebtToken,
  MockPoolV2,
} from './../typechain';
import { EMPTY_STORAGE_SLOT, ZERO_ADDRESS } from './constants';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getPoolLibraries } from './contract-getters';
import { tEthereumAddress, tStringTokenSmallUnits } from './types';
import { MintableERC20 } from '../typechain';
import { deployContract } from './utilities/tx';
import { POOL_ADDRESSES_PROVIDER_ID } from './deploy-ids';
import {
  HopeOracle,
  HopeLendProtocolDataProvider,
  ACLManager,
  HToken,
  ConfiguratorLogic,
  DefaultReserveInterestRateStrategy,
  InitializableImmutableAdminUpgradeabilityProxy,
  MintableDelegationERC20,
  InitializableAdminUpgradeabilityProxy,
  L2Pool,
  L2Encoder,
} from '../typechain';

import { waitForTx } from './utilities/tx';

import {
  MockAggregator,
  MockHToken,
  MockFlashLoanReceiver,
  MockInitializableFromConstructorImple,
  MockInitializableImple,
  MockInitializableImpleV2,
  MockPool,
  MockPoolInherited,
  MockReentrantInitializableImple,
  MockReserveConfiguration,
  MockStableDebtToken,
  MockVariableDebtToken,
  Pool,
  PoolAddressesProvider,
  PoolAddressesProviderRegistry,
  PoolConfigurator,
  PriceOracle,
  ReservesSetupHelper,
  StableDebtToken,
  UiPoolDataProvider,
  VariableDebtToken,
  WETH9Mocked,
  WrappedTokenGateway,
} from '../typechain';

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

export const deployUiPoolDataProvider = async (
  chainlinkAggregatorProxy: string,
  chainlinkEthUsdAggregatorProxy: string
) =>
  await deployContract<UiPoolDataProvider>('UiPoolDataProvider', [
    chainlinkAggregatorProxy,
    chainlinkEthUsdAggregatorProxy,
  ]);

export const deployPoolAddressesProvider = async (marketId: string) =>
  await deployContract<PoolAddressesProvider>('PoolAddressesProvider', [marketId]);

export const deployPoolAddressesProviderRegistry = async () =>
  await deployContract<PoolAddressesProviderRegistry>('PoolAddressesProviderRegistry');

export const deployACLManager = async (provider: tEthereumAddress) =>
  await deployContract<ACLManager>('ACLManager', [provider]);

export const deployConfiguratorLogicLibrary = async () =>
  await deployContract<ConfiguratorLogic>('ConfiguratorLogic');

export const deployPoolConfigurator = async () => {
  const configuratorLogicArtifact = await hre.deployments.get('ConfiguratorLogic');
  return await deployContract<PoolConfigurator>('PoolConfigurator', [], {
    ConfiguratorLogic: configuratorLogicArtifact.address,
  });
};

export const deployPool = async (provider?: tEthereumAddress) => {
  const libraries = await getPoolLibraries();
  provider = provider || (await (await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID)).address);

  return await deployContract<Pool>('Pool', [provider], libraries);
};

export const deployMockPoolInherited = async (provider?: tEthereumAddress) => {
  const libraries = await getPoolLibraries();
  provider = provider || (await (await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID)).address);

  return await deployContract<MockPoolInherited>('MockPoolInherited', [provider], libraries);
};

export const deployPriceOracle = async () => await deployContract<PriceOracle>('PriceOracle');

export const deployMockAggregator = async (price: tStringTokenSmallUnits) =>
  await deployContract<MockAggregator>('MockAggregator', [price]);

export const deployHopeOracle = async (
  args: [
    tEthereumAddress,
    tEthereumAddress[],
    tEthereumAddress[],
    tEthereumAddress,
    tEthereumAddress,
    string
  ]
) => deployContract<HopeOracle>('HopeOracle', args);

export const deployMockFlashLoanReceiver = async (addressesProvider: tEthereumAddress) =>
  deployContract<MockFlashLoanReceiver>('MockFlashLoanReceiver', [addressesProvider]);

export const deployHopeLendProtocolDataProvider = async (addressesProvider: tEthereumAddress) =>
  deployContract<HopeLendProtocolDataProvider>('HopeLendProtocolDataProvider', [addressesProvider]);

export const deployMintableERC20 = async (args: [string, string, string]) =>
  deployContract<MintableERC20>('MintableERC20', args);

export const deployMintableDelegationERC20 = async (args: [string, string, string]) =>
  deployContract<MintableDelegationERC20>('MintableDelegationERC20', args);

export const deployDefaultReserveInterestRateStrategy = async (
  args: [tEthereumAddress, string, string, string, string, string, string, string, string, string]
) => deployContract<DefaultReserveInterestRateStrategy>('DefaultReserveInterestRateStrategy', args);

export const deployGenericStableDebtToken = async (poolAddress: tEthereumAddress) =>
  deployContract<StableDebtToken>('StableDebtToken', [poolAddress]);

export const deployGenericVariableDebtToken = async (poolAddress: tEthereumAddress) =>
  deployContract<VariableDebtToken>('VariableDebtToken', [poolAddress]);

export const deployGenericHToken = async ([
  poolAddress,
  underlyingAssetAddress,
  treasuryAddress,
  name,
  symbol,
]: [tEthereumAddress, tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string]) => {
  const instance = await deployContract<HToken>('HToken', [poolAddress]);

  await instance.initialize(
    poolAddress,
    treasuryAddress,
    underlyingAssetAddress,
    '18',
    name,
    symbol,
    '0x10'
  );

  return instance;
};

export const deployGenericHTokenImpl = async (poolAddress: tEthereumAddress) =>
  deployContract<HToken>('HToken', [poolAddress]);

export const deployReservesSetupHelper = async () =>
  deployContract<ReservesSetupHelper>('ReservesSetupHelper');

export const deployInitializableImmutableAdminUpgradeabilityProxy = async (
  args: [tEthereumAddress]
) =>
  deployContract<InitializableImmutableAdminUpgradeabilityProxy>(
    'InitializableImmutableAdminUpgradeabilityProxy',
    args
  );

export const deployMockStableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockStableDebtToken>('MockStableDebtToken', [args[0]]);

  await instance.initialize(args[0], args[1], '18', args[2], args[3], args[4]);

  return instance;
};

export const deployWETHMocked = async () => deployContract<WETH9Mocked>('WETH9Mocked');

export const deployMockVariableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockVariableDebtToken>('MockVariableDebtToken', [args[0]]);

  await instance.initialize(args[0], args[1], '18', args[2], args[3], args[4]);

  return instance;
};

export const deployMockHToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockHToken>('MockHToken', [args[0]]);

  await instance.initialize(args[0], args[2], args[1], '18', args[3], args[4], args[5]);

  return instance;
};

export const deployMockL2HToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockL2HToken>('MockL2HToken', [args[0]]);

  await instance.initialize(args[0], args[2], args[1], '18', args[3], args[4], args[5]);

  return instance;
};

export const deployMockL2VariableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockL2VariableDebtToken>('MockL2VariableDebtToken', [
    args[0],
  ]);

  await instance.initialize(args[0], args[1], '18', args[2], args[3], args[4]);

  return instance;
};

export const deployMockL2StableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, string, string, string]
) => {
  const instance = await deployContract<MockL2StableDebtToken>('MockL2StableDebtToken', [args[0]]);

  await instance.initialize(args[0], args[1], '18', args[2], args[3], args[4]);

  return instance;
};

export const deployMockReserveConfiguration = async () =>
  deployContract<MockReserveConfiguration>('MockReserveConfiguration');

export const deployMockPool = async () => deployContract<MockPool>('MockPool');

export const deployMockPoolV2 = async (providerAddress: tEthereumAddress) => {
  const instance = await deployContract<MockPoolV2>('MockPoolV2');

  instance.initialize(providerAddress);

  return instance;
};

export const deployMockHopeLendEcosystemReserveV2 = async () =>
  deployContract<MockHopeLendEcosystemReserveV2>('MockHopeLendEcosystemReserveV2');

export const deployMockInitializableImple = async () =>
  deployContract<MockInitializableImple>('MockInitializableImple');

export const deployMockInitializableImpleV2 = async () =>
  deployContract<MockInitializableImpleV2>('MockInitializableImpleV2');

export const deployMockInitializableFromConstructorImple = async (args: [string]) =>
  deployContract<MockInitializableFromConstructorImple>(
    'MockInitializableFromConstructorImple',
    args
  );

export const deployMockReentrantInitializableImple = async () =>
  deployContract<MockReentrantInitializableImple>('MockReentrantInitializableImple');

export const deployWrappedTokenGateway = async (wrappedToken: tEthereumAddress) =>
  deployContract<WrappedTokenGateway>('WrappedTokenGateway', [wrappedToken]);

export const deployInitializableAdminUpgradeabilityProxy = async (
  slug: string
): Promise<InitializableAdminUpgradeabilityProxy> =>
  deployContract<InitializableAdminUpgradeabilityProxy>(
    'InitializableAdminUpgradeabilityProxy',
    [],
    undefined,
    slug
  );

export const deployCalldataLogicLibrary = async () => deployContract('CalldataLogic');

export const deployL2DeployerImplementation = async (
  addressesProviderAddress: tEthereumAddress
): Promise<L2Pool> => {
  const commonLibraries = await getPoolLibraries();
  const CalldataLogic = await (await hre.deployments.get('EModeLogic')).address;

  return deployContract<L2Pool>('L2Pool', [addressesProviderAddress], {
    ...commonLibraries,
    CalldataLogic,
  });
};

export const deployL2Mock2Pool = async (addressesProviderAddress: tEthereumAddress) =>
  deployContract<MockL2Pool>('MockL2Pool', [addressesProviderAddress]);

export const deployL2Encoder = async (poolProxy: tEthereumAddress) =>
  deployContract<L2Encoder>('L2Encoder', [poolProxy]);
