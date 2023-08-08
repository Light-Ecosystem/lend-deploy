import { parseUnits } from 'ethers/lib/utils';
import { IInterestRateStrategyParams } from '../../helpers/types';

export const rateStrategyVolatileOne: IInterestRateStrategyParams = {
  name: 'rateStrategyVolatileOne',
  optimalUsageRatio: parseUnits('0.45', 27).toString(),
  baseVariableBorrowRate: '0',
  variableRateSlope1: parseUnits('0.07', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.07', 27).toString(),
  stableRateSlope2: parseUnits('3', 27).toString(),
  baseStableRateOffset: parseUnits('0.02', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyStableOne: IInterestRateStrategyParams = {
  name: 'rateStrategyStableOne',
  optimalUsageRatio: parseUnits('0.9', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.04', 27).toString(),
  variableRateSlope2: parseUnits('0.6', 27).toString(),
  stableRateSlope1: parseUnits('0.005', 27).toString(),
  stableRateSlope2: parseUnits('0.6', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.08', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyStableTwo: IInterestRateStrategyParams = {
  name: 'rateStrategyStableTwo',
  optimalUsageRatio: parseUnits('0.8', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.04', 27).toString(),
  variableRateSlope2: parseUnits('0.75', 27).toString(),
  stableRateSlope1: parseUnits('0.005', 27).toString(),
  stableRateSlope2: parseUnits('0.75', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.08', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyWETH: IInterestRateStrategyParams = {
  name: 'rateStrategyWETH',
  optimalUsageRatio: parseUnits('0.8', 27).toString(),
  baseVariableBorrowRate: parseUnits('0.01', 27).toString(),
  variableRateSlope1: parseUnits('0.038', 27).toString(),
  variableRateSlope2: parseUnits('0.8', 27).toString(),
  stableRateSlope1: parseUnits('0.04', 27).toString(),
  stableRateSlope2: parseUnits('0.8', 27).toString(),
  baseStableRateOffset: parseUnits('0.068', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyWstETH: IInterestRateStrategyParams = {
  name: 'rateStrategyWstETH',
  optimalUsageRatio: parseUnits('0.45', 27).toString(),
  baseVariableBorrowRate: parseUnits('0.0025', 27).toString(),
  variableRateSlope1: parseUnits('0.045', 27).toString(),
  variableRateSlope2: parseUnits('0.8', 27).toString(),
  stableRateSlope1: parseUnits('0.04', 27).toString(),
  stableRateSlope2: parseUnits('0.8', 27).toString(),
  baseStableRateOffset: parseUnits('0.075', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyUSDT: IInterestRateStrategyParams = {
  name: 'rateStrategyUSDT',
  optimalUsageRatio: parseUnits('0.8', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.04', 27).toString(),
  variableRateSlope2: parseUnits('0.75', 27).toString(),
  stableRateSlope1: parseUnits('0.005', 27).toString(),
  stableRateSlope2: parseUnits('0.72', 27).toString(),
  baseStableRateOffset: parseUnits('0.05', 27).toString(),
  stableRateExcessOffset: parseUnits('0.08', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyUSDC: IInterestRateStrategyParams = {
  name: 'rateStrategyUSDC',
  optimalUsageRatio: parseUnits('0.8', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.035', 27).toString(),
  variableRateSlope2: parseUnits('0.6', 27).toString(),
  stableRateSlope1: parseUnits('0.005', 27).toString(),
  stableRateSlope2: parseUnits('0.6', 27).toString(),
  baseStableRateOffset: parseUnits('0.045', 27).toString(),
  stableRateExcessOffset: parseUnits('0.08', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyHOPE: IInterestRateStrategyParams = {
  name: 'rateStrategyHOPE',
  optimalUsageRatio: parseUnits('0.7', 27).toString(),
  baseVariableBorrowRate: parseUnits('0.01', 27).toString(),
  variableRateSlope1: parseUnits('0.05', 27).toString(),
  variableRateSlope2: parseUnits('1', 27).toString(),
  stableRateSlope1: parseUnits('0.07', 27).toString(),
  stableRateSlope2: parseUnits('1', 27).toString(),
  baseStableRateOffset: parseUnits('0.02', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyStakingHOPE: IInterestRateStrategyParams = {
  name: 'rateStrategyStakingHOPE',
  optimalUsageRatio: parseUnits('0.7', 27).toString(),
  baseVariableBorrowRate: parseUnits('0.0075', 27).toString(),
  variableRateSlope1: parseUnits('0.055', 27).toString(),
  variableRateSlope2: parseUnits('1', 27).toString(),
  stableRateSlope1: parseUnits('0.07', 27).toString(),
  stableRateSlope2: parseUnits('1', 27).toString(),
  baseStableRateOffset: parseUnits('0.025', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyWBTC: IInterestRateStrategyParams = {
  name: 'rateStrategyWBTC',
  optimalUsageRatio: parseUnits('0.45', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.04', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.07', 27).toString(),
  stableRateSlope2: parseUnits('3', 27).toString(),
  baseStableRateOffset: parseUnits('0.06', 27).toString(),
  stableRateExcessOffset: parseUnits('0.05', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};
