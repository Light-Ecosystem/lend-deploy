import { parseUnits } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from '../../helpers/constants';
import {
  ICommonConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
  TransferStrategy,
  AssetType,
} from '../../helpers/types';
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from './rateStrategies';
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'Testnet HopeLend Market',
  HTokenNamePrefix: 'Testnet',
  StableDebtTokenNamePrefix: 'Testnet',
  VariableDebtTokenNamePrefix: 'Testnet',
  SymbolPrefix: 'Test',
  ProviderId: 0,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: '8',
  WrappedNativeTokenSymbol: 'WETH',
  ChainlinkAggregator: {
    [eEthereumNetwork.main]: {
      HOPE: '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
      DAI: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
      LINK: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',
      USDC: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
      WBTC: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
      WETH: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      USDT: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
      // Note: EUR/USD, not EURS dedicated oracle
      EURS: '0xb49f677943BC038e9857d61E7d053CaA2C1734C1',
    },
    [eArbitrumNetwork.arbitrumTestnet]: {
      LINK: '0x52C9Eb2Cc68555357221CAe1e5f2dD956bC194E5',
      USDC: '0xe020609A0C31f4F96dCBB8DF9882218952dD95c4',
      DAI: '0xcAE7d280828cf4a0869b26341155E4E9b864C7b2',
      WBTC: '0x0c9973e7a27d00e656B9f153348dA46CaD70d03d',
      WETH: '0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8',
      USDT: '0xb1Ac85E779d05C2901812d812210F6dE144b2df0',
      EURS: ZERO_ADDRESS,
    },
    [eEthereumNetwork.rinkeby]: {
      LINK: ZERO_ADDRESS,
      USDC: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
      DAI: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
  ReserveFactorTreasuryAddress: {
    [eEthereumNetwork.kovan]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eEthereumNetwork.main]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eArbitrumNetwork.arbitrumTestnet]: '0xeC67987831C4278160D8e652d3edb0Fc45B3766d',
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  FallbackOracle: {
    [eEthereumNetwork.kovan]: '0x50913E8E1c650E790F8a1E741FF9B1B1bB251dfe',
    [eEthereumNetwork.main]: '0x5b09e578cfeaa23f1b11127a658855434e4f3e09',
    [eArbitrumNetwork.arbitrum]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrumTestnet]: ZERO_ADDRESS,
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  EModes: {
    StableEMode: {
      id: '1',
      ltv: '9800',
      liquidationThreshold: '9850',
      liquidationBonus: '10100',
      label: 'Stable-EMode',
      assets: ['USDC', 'DAI'],
    },
  },
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  HOPEAddress: {
    [eEthereumNetwork.sepolia]: '0xf49Eb6f1E7a5C48E14dB30cBfDB264430FA6cBcc',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  StakingHOPEAddress: {
    [eEthereumNetwork.sepolia]: '0x5f79a791225803F1039fC6316c94B269D7eE9cb1',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  GaugeControllerAddress: {
    [eEthereumNetwork.sepolia]: '0xeba0e37F77e2ddC6512d6982B5222297Eb3a37D4',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: '0x4BDB0F69f233C02bd82d5e5fBdF7e6F206E9FdE5',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  LTAddress: {
    [eEthereumNetwork.sepolia]: '0x6EC9cA983B57e9eE89fC06Fa4AC0dC0213fe155E',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: '0xcb4DD14E9b4899f582E7aD7826431e0411B2C59e',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  BurnerManagerAddress: {
    [eEthereumNetwork.sepolia]: '0x9bA97e0913Dd0fbd4E5fedA936db9D1f1C632273',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  UnderlyingBurnerAddress: {
    [eEthereumNetwork.sepolia]: '0xaAfAa8d21eCDE9cD8C150cAA93413AaDc604D88a',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  Permit2Address: {
    [eEthereumNetwork.sepolia]: '0x5aB6249458227De13a2384bBeA5E231Cab2f5723',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  FeeToVault: {
    [eEthereumNetwork.sepolia]: '',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
};
