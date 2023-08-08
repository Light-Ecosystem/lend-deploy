import { task } from 'hardhat/config';
import { ConfigNames, loadPoolConfig } from '../../helpers/market-config-helpers';
import { MARKET_NAME } from '../../helpers/env';
import { IHopeLendConfiguration, POOL_ADDRESSES_PROVIDER_ID } from '../../helpers';

task(`deploy-strategy`, `Deploy stHOPE strategy`).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();
  const poolConfig = (await loadPoolConfig(MARKET_NAME as ConfigNames)) as IHopeLendConfiguration;

  const addressProviderArtifact = await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID);
  const { RateStrategies } = poolConfig;

  for (const strategy in RateStrategies) {
    const strategyData = RateStrategies[strategy];
    const args = [
      addressProviderArtifact.address,
      strategyData.optimalUsageRatio,
      strategyData.baseVariableBorrowRate,
      strategyData.variableRateSlope1,
      strategyData.variableRateSlope2,
      strategyData.stableRateSlope1,
      strategyData.stableRateSlope2,
      strategyData.baseStableRateOffset,
      strategyData.stableRateExcessOffset,
      strategyData.optimalStableToTotalDebtRatio,
    ];
    await hre.deployments.deploy(`ReserveStrategy-${strategyData.name}`, {
      from: deployer,
      args: args,
      contract: 'DefaultReserveInterestRateStrategy',
      log: true,
    });
  }
});
