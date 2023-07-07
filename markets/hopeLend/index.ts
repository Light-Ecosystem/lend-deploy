import { eOptimismNetwork } from '../../helpers/types';
import { ZERO_ADDRESS } from '../../helpers';
import { IHopeLendConfiguration, eEthereumNetwork, eArbitrumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyUSDC,
  strategyLINK,
  strategyWBTC,
  strategyWETH,
  strategyUSDT,
  strategyEURS,
  strategyHOPE,
  strategyStakingHOPE,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const HopeLendMarket: IHopeLendConfiguration = {
  ...CommonsConfig,
  MarketId: 'Ethereum HopeLend Market',
  HTokenNamePrefix: 'Ethereum',
  StableDebtTokenNamePrefix: 'Ethereum',
  VariableDebtTokenNamePrefix: 'Ethereum',
  SymbolPrefix: 'Eth',
  ProviderId: 1,
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    USDT: strategyUSDT,
    HOPE: strategyHOPE,
    StakingHOPE: strategyStakingHOPE,
  },
  ReserveAssets: {
    [eEthereumNetwork.sepolia]: {
      DAI: '0xAd4979AE4a275c4f6bc194c14C3b3CFBcD435abb',
      USDC: '0x06446E7Bd1f211C3189cfeCF3CDE488757eb5e4f',
      WBTC: '0xAF48F7c5866c0Fd63492bAc0b7816c1933c4D43a',
      WETH: '0xE55a23aaFb3a712BFae5BE96E0f61C745dedf33C',
      USDT: '0x76127399A0CafeDB59615A93A7ACF8552c1aEE4c',
      HOPE: '0x70C8C67CfbE228c7437Ec586a751a408e23355F4',
      StakingHOPE: '0x03D69A55579496821D8FdF0769F0C1a4A195788A',
    },
    [eEthereumNetwork.main]: {
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      HOPE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      EURS: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
    },
    [eEthereumNetwork.rinkeby]: {
      HOPE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
};

export default HopeLendMarket;
