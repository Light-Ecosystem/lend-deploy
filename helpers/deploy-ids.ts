import { MARKET_NAME } from './env';

export const POOL_ADDRESSES_PROVIDER_ID = `PoolAddressesProvider-${MARKET_NAME}`;
export const ACL_MANAGER_ID = `ACLManager-${MARKET_NAME}`;
export const IMPL_ID = 'Implementation';
export const PROXY_ID = 'Proxy';
export const POOL_IMPL_ID = `Pool-${IMPL_ID}`;
export const L2_POOL_IMPL_ID = `L2Pool-${IMPL_ID}`;
export const POOL_CONFIGURATOR_IMPL_ID = `PoolConfigurator-${IMPL_ID}`;
export const POOL_PROXY_ID = `Pool-${PROXY_ID}-${MARKET_NAME}`;
export const POOL_CONFIGURATOR_PROXY_ID = `PoolConfigurator-${PROXY_ID}-${MARKET_NAME}`;
export const POOL_DATA_PROVIDER = `PoolDataProvider-${MARKET_NAME}`;
export const HTOKEN_IMPL_ID = `HToken-${MARKET_NAME}`;
export const STABLE_DEBT_TOKEN_IMPL_ID = `StableDebtToken-${MARKET_NAME}`;
export const VARIABLE_DEBT_TOKEN_IMPL_ID = `VariableDebtToken-${MARKET_NAME}`;
export const RESERVES_SETUP_HELPER_ID = 'ReservesSetupHelper';
export const ORACLE_ID = `HopeOracle-${MARKET_NAME}`;
export const FALLBACK_ORACLE_ID = `FallbackOracle-${MARKET_NAME}`;
export const TREASURY_PROXY_ID = 'TreasuryProxy';
export const TREASURY_IMPL_ID = `Treasury-${IMPL_ID}`;
export const TREASURY_CONTROLLER_ID = `Treasury-Controller`;
export const FAUCET_ID = `ERC20Faucet-${MARKET_NAME}`;
export const HOPELEND_COLLECTOR_PROXY_ID = `HopeLendCollector-${PROXY_ID}-${MARKET_NAME}`;
export const HOPELEND_COLLECTOR_IMPL_ID = `HopeLendCollector-${IMPL_ID}-${MARKET_NAME}`;
export const TESTNET_TOKEN_PREFIX = `-TestnetMintableERC20-${MARKET_NAME}`;
export const TESTNET_PRICE_AGGR_PREFIX = `-TestnetPriceAggregator-${MARKET_NAME}`;
export const HTOKEN_PREFIX = `-HToken-${MARKET_NAME}`;
export const VARIABLE_DEBT_PREFIX = `-VariableDebtToken-${MARKET_NAME}`;
export const STABLE_DEBT_PREFIX = `-StableDebtToken-${MARKET_NAME}`;
export const L2_ENCODER = 'L2Encoder';
export const LENDING_GAUGE_IMPL_ID = `LendingGauge-${IMPL_ID}`;
export const GAUGE_FACTORY_ID = 'GaugeFactory';

export const HOPE_ID = `HOPE${TESTNET_TOKEN_PREFIX}`;
export const STAKING_HOPE_ID = `StakingHOPE${TESTNET_TOKEN_PREFIX}`;
export const LT_ID = 'LT';
export const VOTING_ESCROW_ID = 'VotingEscrow';
export const GAUGE_CONTROLLER_ID = 'GaugeController';
export const MINTER_ID = 'Minter';
export const PERMIT2_ID = 'Permit2';
export const BURNER_MANAGER_ID = 'BurnerManager';
export const UNDERLYING_BURNER_ID = 'UnderlyingBurner';
export const FEE_TO_VAULT_ID = 'FeeToVault';
export const PROXY_ADMIN_ID = 'ProxyAdmin';
