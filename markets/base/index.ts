import { eArbitrumNetwork, eBaseNetwork, IHopeLendConfiguration } from '../../helpers/types';
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

export const BaseConfig: IHopeLendConfiguration = {
  ...HopeLendMarket,
  MarketId: 'Base HopeLend Market',
  HTokenNamePrefix: 'Base',
  StableDebtTokenNamePrefix: 'Base',
  VariableDebtTokenNamePrefix: 'Base',
  SymbolPrefix: 'Base',
  ProviderId: 37,
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
    [eBaseNetwork.base]: {
      WETH: '0x6209f6CADe90416BecaAA48Ca693D2652ecc36D9',
      wstETH: '0xf963aB230E0F2cF77dd6F834075D0cfa790BD443',
      USDT: '0x6E572751AaE03719Cd0b53B3551db323eA2e2050',
      USDC: '0xD218270a11a3a8E614Ebf8AE8FD3D269a52ac114',
      HOPE: '0x498C60F24E078efA5B34a952c5777aDa39C1bADB',
      stHOPE: '0x04c3dc90DD5d90De92Fa226697CF17c5875f63Af',
      WBTC: '0x3740A76b06653bb3f00bD7EEF0A8E8aA32B2B6c5',
    },
    [eBaseNetwork.baseGoerli]: {
      WETH: '0x4e161d400612514046eF9BC78692843bcec81C91',
      wstETH: '0xcF2Cd03a6FB1A4F0D02c2675adcCd8ecc76024A0',
      USDT: '0x02f14C1D8777084E1359B64Bcc988412a25B74c7',
      USDC: '0x486a73D30137AD6B979B09f9C0047CbE9B36102B',
      HOPE: '0x26100653722f1304B172f0B07e83dB60b9ef0296',
      stHOPE: '0x72A400c226de7b7A418ec8FBA8F283f16D5158e0',
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
    [eBaseNetwork.base]: {
      WETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      wstETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      USDT: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      USDC: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7',
      HOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      stHOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      WBTC: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    },
    [eBaseNetwork.baseGoerli]: {
      WETH: '0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2',
      wstETH: '0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2',
      USDT: '0xd5973EB46D6fE54E82C5337dD9536B35D080912C',
      USDC: '0xb85765935B4d9Ab6f841c9a00690Da5F34368bc0',
      HOPE: '0xba00A6EA87007E4cD1F95c16aa596196De54aFcA',
      stHOPE: '0xba00A6EA87007E4cD1F95c16aa596196De54aFcA',
      WBTC: '0xAC15714c08986DACC0379193e22382736796496f',
    },
  },
};

export default BaseConfig;
