import { task } from 'hardhat/config';
import {
  ConfigNames,
  getReserveAddresses,
  getTreasuryAddress,
  loadPoolConfig,
  savePoolTokens,
} from '../../helpers/market-config-helpers';
import { MARKET_NAME } from '../../helpers/env';
import {
  FORK,
  IHopeLendConfiguration,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_DATA_PROVIDER,
  configureReservesByHelper,
  eNetwork,
  initReservesByHelper,
} from '../../helpers';

task(`setup-init-reserves`, `Init reserves`).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();
  const poolConfig = (await loadPoolConfig(MARKET_NAME as ConfigNames)) as IHopeLendConfiguration;
  const network = (FORK ? FORK : hre.network.name) as eNetwork;

  const {
    HTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReservesConfig,
  } = poolConfig;

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
  hre.deployments.log(`[Deployment] Initialized all reserves`);

  await configureReservesByHelper(ReservesConfig, reservesAddresses);

  // Save HToken and Debt tokens artifacts
  const dataProvider = await hre.deployments.get(POOL_DATA_PROVIDER);
  await savePoolTokens(reservesAddresses, dataProvider.address);

  hre.deployments.log(`[Deployment] Configured all reserves`);
});
