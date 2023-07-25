import { eOptimismNetwork } from '../../helpers/types';
import { ZERO_ADDRESS } from '../../helpers';
import { IHopeLendConfiguration, eEthereumNetwork, eArbitrumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyDAI,
  strategyUSDC,
  strategyWBTC,
  strategyWETH,
  strategyUSDT,
  strategyHOPE,
  strategyStakingHOPE,
  strategyWstETH,
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
    WETH: strategyWETH,
    wstETH: strategyWstETH,
    USDT: strategyUSDT,
    USDC: strategyUSDC,
    HOPE: strategyHOPE,
    stHOPE: strategyHOPE,
    WBTC: strategyWBTC,
  },
  ReserveAssets: {
    [eEthereumNetwork.sepolia]: {
      WETH: '0x6209f6CADe90416BecaAA48Ca693D2652ecc36D9',
      wstETH: '0xf963aB230E0F2cF77dd6F834075D0cfa790BD443',
      USDT: '0x6E572751AaE03719Cd0b53B3551db323eA2e2050',
      USDC: '0xD218270a11a3a8E614Ebf8AE8FD3D269a52ac114',
      HOPE: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
      stHOPE: '0x04c3dc90DD5d90De92Fa226697CF17c5875f63Af',
      WBTC: '0x3740A76b06653bb3f00bD7EEF0A8E8aA32B2B6c5',
    },
    [eEthereumNetwork.goerli]: {
      WETH: '0x6Cc53D3AeaEe7aAfbd2Ac304AA64d017E6cb4f2a',
      wstETH: '0x050af32f9FEA93231fCFf7a44181A2a7dA9b4A80',
      USDT: '0x1C6Cf7Df9dFC87d2C373FF12F713e3222356783f',
      USDC: '0x832c2B8efb16Ffabc73e1F23D31f3B574Ff0b7F6',
      HOPE: '0xdC857E0d4C850deAe3a7735390243d3c444E552F',
      stHOPE: '0x09B4621e2A9dBd37550dC4923E60Ff0782Ef9250',
      WBTC: '0x5e457e88503c47C85C106edB4e27208bBBA26d7f',
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
