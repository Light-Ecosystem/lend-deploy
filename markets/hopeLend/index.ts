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
  ProviderId: 30,
  ReservesConfig: {
    DAI: strategyDAI,
    LINK: strategyLINK,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    USDT: strategyUSDT,
    EURS: strategyEURS,
    HOPE: strategyHOPE,
    StakingHOPE: strategyStakingHOPE,
  },
  ReserveAssets: {
    [eEthereumNetwork.sepolia]: {
      DAI: '0xc527C4003B0554A5703FA666D7D45dB205e3de99',
      LINK: '0x027b143919AE292f61386AA6dE06f892e1C947d9',
      USDC: '0x6A9d4913AC8266A1dEbCfC6d5B6Ea275Fd19cD85',
      WBTC: '0x8520E10eA26c761a98bE06eA252cd30E83f4FB4B',
      WETH: '0x218B00cfb6f4ae38c43c83d1E6eBA8f25FD2324C',
      USDT: '0x62D8460025DE81982C843B14E7F18Ff2273ea491',
      HOPE: '0x784388A036cb9c8c680002F43354E856f816F844',
      StakingHOPE: '0x092c325a98e50BE78A140cD043D49904fFB8Ea1F',
      EURS: '0x0fdcBABb76c0A60a9F28e60940027C48dF88347A',
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
