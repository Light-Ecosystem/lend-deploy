import { eArbitrumNetwork, IHopeLendConfiguration } from './../../helpers/types';
import HopeLendMarket from '../hopeLend';
import { ZERO_ADDRESS } from '../../helpers';
import {
  strategyDAI,
  strategyUSDC,
  strategyWBTC,
  strategyWETH,
  strategyUSDT,
  strategyHOPE,
  strategyWstETH,
  strategyStakingHOPE,
} from '../hopeLend/reservesConfigs';

export const ArbitrumConfig: IHopeLendConfiguration = {
  ...HopeLendMarket,
  MarketId: 'Arbitrum HopeLend Market',
  HTokenNamePrefix: 'Arbitrum',
  StableDebtTokenNamePrefix: 'Arbitrum',
  VariableDebtTokenNamePrefix: 'Arbitrum',
  SymbolPrefix: 'Arb',
  ProviderId: 36,
  ReservesConfig: {
    WETH: strategyWETH,
    wstETH: strategyWstETH,
    USDT: strategyUSDT,
    USDC: strategyUSDC,
    HOPE: strategyHOPE,
    stHOPE: strategyStakingHOPE,
    WBTC: strategyWBTC,
  },
  ReserveAssets: {
    [eArbitrumNetwork.arbitrum]: {
      WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      wstETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
      USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      HOPE: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
      stHOPE: '0x04c3dc90DD5d90De92Fa226697CF17c5875f63Af',
      WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    },
    [eArbitrumNetwork.arbitrumGoerli]: {
      WETH: '0x4e161d400612514046eF9BC78692843bcec81C91',
      wstETH: '0xcF2Cd03a6FB1A4F0D02c2675adcCd8ecc76024A0',
      USDT: '0x02f14C1D8777084E1359B64Bcc988412a25B74c7',
      USDC: '0x486a73D30137AD6B979B09f9C0047CbE9B36102B',
      HOPE: '0x26100653722f1304B172f0B07e83dB60b9ef0296',
      stHOPE: '0xD5315E662e72683B817c9a96Adea6158d43F3b55',
      WBTC: '0x3578E1827dBdf374b9c7DD9283fc5DC140a8d045',
    },
  },
  EModes: {
    StableEMode: {
      id: '1',
      ltv: '9700',
      liquidationThreshold: '9750',
      liquidationBonus: '10100',
      label: 'Stablecoins',
      assets: ['USDC', 'USDT'],
    },
  },
  ChainlinkAggregator: {
    [eArbitrumNetwork.arbitrum]: {
      WETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      wstETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      USDT: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      USDC: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7',
      HOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      stHOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      WBTC: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    },
    [eArbitrumNetwork.arbitrumGoerli]: {
      WETH: '0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08',
      wstETH: '0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08',
      USDT: '0x0a023a3423D9b27A0BE48c768CCF2dD7877fEf5E',
      USDC: '0x1692Bdd32F31b831caAc1b0c9fAF68613682813b',
      HOPE: '0x277027E70b5E5e72B238814C1B792b08469932eF',
      stHOPE: '0x277027E70b5E5e72B238814C1B792b08469932eF',
      WBTC: '0x6550bc2301936011c1334555e62A87705A81C12C',
    },
  },
};

export default ArbitrumConfig;
