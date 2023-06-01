import {
  HopeOracle,
  ACLManager,
  HToken,
  BorrowLogic,
  BridgeLogic,
  EModeLogic,
  FlashLoanLogic,
  IERC20Detailed,
  LiquidationLogic,
  MockInitializableImple,
  MockInitializableImpleV2,
  Pool,
  PoolAddressesProvider,
  PoolConfigurator,
  PriceOracle,
  StableDebtToken,
  SupplyLogic,
  VariableDebtToken,
  WETH9,
  WETH9Mocked,
  HopeLendProtocolDataProvider,
  MintableERC20,
  DefaultReserveInterestRateStrategy,
  MockFlashLoanReceiver,
  PoolAddressesProviderRegistry,
  ReservesSetupHelper,
  MockVariableDebtToken,
  MockStableDebtToken,
  MockPool,
  ERC20Faucet,
  WrappedTokenGateway,
  UiPoolDataProvider,
  WalletBalanceProvider,
} from '../typechain';
import { tEthereumAddress } from './types';
import {
  POOL_ADDRESSES_PROVIDER_ID,
  ACL_MANAGER_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_PROXY_ID,
  POOL_DATA_PROVIDER,
  ORACLE_ID,
  FALLBACK_ORACLE_ID,
  TESTNET_TOKEN_PREFIX,
  FAUCET_ID,
  L2_ENCODER,
  LT_ID,
  GAUGE_CONTROLLER_ID,
  VOTING_ESCROW_ID,
  MINTER_ID,
  LENDING_GAUGE_IMPL_ID,
  GAUGE_FACTORY_ID,
} from './deploy-ids';
import LTArtifact from '../extendedArtifacts/LT.json';
import StakingHOPEArtifact from '../extendedArtifacts/StakingHOPE.json';
import VotingEscrowArtifact from '../extendedArtifacts/VotingEscrow.json';
import GaugeControllerArtifact from '../extendedArtifacts/GaugeController.json';
import MinterArtifact from '../extendedArtifacts/Minter.json';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Libraries } from 'hardhat-deploy/dist/types';
import { getContract, getContractByABI } from './utilities/tx';
import { Address } from 'hardhat-deploy/types';
import { Contract } from 'ethers';

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

export const getHToken = async (address: tEthereumAddress): Promise<HToken> =>
  getContract('HToken', address);

export const getVariableDebtToken = async (address: tEthereumAddress): Promise<VariableDebtToken> =>
  getContract('VariableDebtToken', address);

export const getStableDebtToken = async (address: tEthereumAddress): Promise<StableDebtToken> =>
  getContract('StableDebtToken', address);

export const getERC20 = async (address: tEthereumAddress): Promise<IERC20Detailed> =>
  getContract(
    'lend-core/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed',
    address
  );

export const getWETH = async (address: tEthereumAddress): Promise<WETH9> =>
  getContract('WETH9', address);

export const getPoolAddressesProvider = async (
  address?: tEthereumAddress
): Promise<PoolAddressesProvider> =>
  getContract(
    'PoolAddressesProvider',
    address || (await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID)).address
  );

export const getACLManager = async (address?: tEthereumAddress): Promise<ACLManager> =>
  getContract('ACLManager', address || (await hre.deployments.get(ACL_MANAGER_ID)).address);

export const getPoolConfiguratorProxy = async (
  address?: tEthereumAddress
): Promise<PoolConfigurator> =>
  getContract(
    'PoolConfigurator',
    address || (await hre.deployments.get(POOL_CONFIGURATOR_PROXY_ID)).address
  );

export const getSupplyLogic = async (address?: tEthereumAddress): Promise<SupplyLogic> =>
  getContract('SupplyLogic', address);

export const getBridgeLogic = async (address?: tEthereumAddress): Promise<BridgeLogic> =>
  getContract('BridgeLogic', address);

export const getBorrowLogic = async (address?: tEthereumAddress): Promise<BorrowLogic> =>
  getContract('BorrowLogic', address);

export const getLiquidationLogic = async (address?: tEthereumAddress): Promise<LiquidationLogic> =>
  getContract('LiquidationLogic', address);

export const getEModeLogic = async (address?: tEthereumAddress): Promise<EModeLogic> =>
  getContract('EModeLogic', address);

export const getFlashLoanLogic = async (address?: tEthereumAddress): Promise<FlashLoanLogic> =>
  getContract('FlashLoanLogic', address);

export const getPool = async (address?: tEthereumAddress): Promise<Pool> =>
  getContract('Pool', address || (await hre.deployments.get(POOL_PROXY_ID)).address);

export const getPriceOracle = async (address?: tEthereumAddress): Promise<HopeOracle> =>
  getContract('PriceOracle', address);

export const getIRStrategy = async (
  address: tEthereumAddress
): Promise<DefaultReserveInterestRateStrategy> =>
  getContract('DefaultReserveInterestRateStrategy', address);

export const getMintableERC20 = async (address: tEthereumAddress): Promise<MintableERC20> =>
  getContract('MintableERC20', address);

export const getIErc20Detailed = async (address: tEthereumAddress): Promise<IERC20Detailed> =>
  getContract(
    'lend-core/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed',
    address
  );

export const getHopeLendProtocolDataProvider = async (
  address?: tEthereumAddress
): Promise<HopeLendProtocolDataProvider> =>
  getContract(
    'HopeLendProtocolDataProvider',
    address || (await hre.deployments.get(POOL_DATA_PROVIDER)).address
  );

export const getHopeOracle = async (address?: tEthereumAddress): Promise<HopeOracle> =>
  getContract('HopeOracle', address || (await hre.deployments.get(ORACLE_ID)).address);

export const getFallbackOracle = async (address?: tEthereumAddress): Promise<PriceOracle> =>
  getContract('PriceOracle', address || (await hre.deployments.get(FALLBACK_ORACLE_ID)).address);

export const getMockFlashLoanReceiver = async (
  address?: tEthereumAddress
): Promise<MockFlashLoanReceiver> => getContract('MockFlashLoanReceiver', address);

export const getPoolAddressesProviderRegistry = async (
  address?: tEthereumAddress
): Promise<PoolAddressesProviderRegistry> => getContract('PoolAddressesProviderRegistry', address);

export const getReservesSetupHelper = async (
  address?: tEthereumAddress
): Promise<ReservesSetupHelper> => getContract('ReservesSetupHelper', address);

export const getWETHMocked = async (address?: tEthereumAddress): Promise<WETH9Mocked> =>
  getContract('WETH9Mocked', address);

export const getMockVariableDebtToken = async (
  address: tEthereumAddress
): Promise<MockVariableDebtToken> => getContract('MockVariableDebtToken', address);

export const getMockStableDebtToken = async (
  address: tEthereumAddress
): Promise<MockStableDebtToken> => getContract('MockStableDebtToken', address);

export const getMockPool = async (address?: tEthereumAddress): Promise<MockPool> =>
  getContract('MockPool', address);

export const getMockL2Pool = async (address?: tEthereumAddress): Promise<MockPool> =>
  getContract('MockL2Pool', address);

export const getMockInitializableImple = async (
  address?: tEthereumAddress
): Promise<MockInitializableImple> => getContract('MockInitializableImple', address);

export const getMockInitializableImpleV2 = async (
  address?: tEthereumAddress
): Promise<MockInitializableImpleV2> => getContract('MockInitializableImpleV2', address);

export const getPoolLibraries = async (): Promise<Libraries> => {
  const supplyLibraryArtifact = await hre.deployments.get('SupplyLogic');
  const borrowLibraryArtifact = await hre.deployments.get('BorrowLogic');
  const liquidationLibraryArtifact = await hre.deployments.get('LiquidationLogic');
  const eModeLibraryArtifact = await hre.deployments.get('EModeLogic');
  const bridgeLibraryArtifact = await hre.deployments.get('BridgeLogic');
  const flashLoanLogicArtifact = await hre.deployments.get('FlashLoanLogic');
  const poolLogicArtifact = await hre.deployments.get('PoolLogic');

  return {
    LiquidationLogic: liquidationLibraryArtifact.address,
    SupplyLogic: supplyLibraryArtifact.address,
    EModeLogic: eModeLibraryArtifact.address,
    FlashLoanLogic: flashLoanLogicArtifact.address,
    BorrowLogic: borrowLibraryArtifact.address,
    BridgeLogic: bridgeLibraryArtifact.address,
    PoolLogic: poolLogicArtifact.address,
  };
};

export const getTestnetReserveAddressFromSymbol = async (symbol: string) => {
  const testnetReserve = await hre.deployments.get(`${symbol}${TESTNET_TOKEN_PREFIX}`);
  return testnetReserve.address;
};

export const getERC20Faucet = async (address?: string): Promise<ERC20Faucet> =>
  getContract('ERC20Faucet', address || (await hre.deployments.get(FAUCET_ID)).address);

export const getWrappedTokenGateway = async (address?: string): Promise<WrappedTokenGateway> => {
  return getContract('WrappedTokenGateway', address);
};

export const getUiPoolDataProvider = async (address?: string): Promise<UiPoolDataProvider> =>
  getContract('UiPoolDataProvider', address);

export const getWalletBalanceProvider = async (address?: string): Promise<WalletBalanceProvider> =>
  getContract('WalletBalanceProvider', address);

export const getL2Encoder = async (address?: tEthereumAddress) =>
  getContract('L2Encoder', address || (await hre.deployments.get(L2_ENCODER)).address);

export const getLT = async (address?: tEthereumAddress): Promise<Contract> =>
  getContractByABI('LT', LTArtifact.abi, address || (await hre.deployments.get(LT_ID)).address);

export const getGaugeController = async (address?: tEthereumAddress): Promise<Contract> =>
  getContractByABI(
    'GaugeController',
    GaugeControllerArtifact.abi,
    address || (await hre.deployments.get(GAUGE_CONTROLLER_ID)).address
  );

export const getVotingEscrow = async (address?: tEthereumAddress): Promise<Contract> =>
  getContractByABI(
    'VotingEscrow',
    VotingEscrowArtifact.abi,
    address || (await hre.deployments.get(VOTING_ESCROW_ID)).address
  );

export const getMinter = async (address?: tEthereumAddress): Promise<Contract> =>
  getContractByABI(
    'Minter',
    MinterArtifact.abi,
    address || (await hre.deployments.get(MINTER_ID)).address
  );

export const getLendingGauge = async (address?: tEthereumAddress): Promise<HopeOracle> =>
  getContract(
    'LendingGauge',
    address || (await hre.deployments.get(LENDING_GAUGE_IMPL_ID)).address
  );

export const getGaugeFactory = async (address?: tEthereumAddress): Promise<HopeOracle> =>
  getContract('GaugeFactory', address || (await hre.deployments.get(GAUGE_FACTORY_ID)).address);
