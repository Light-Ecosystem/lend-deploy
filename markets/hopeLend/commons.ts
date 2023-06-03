import {
  AssetType,
  eAvalancheNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  TransferStrategy,
} from '../../helpers/types';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { ICommonConfiguration, eEthereumNetwork, eArbitrumNetwork } from '../../helpers/types';
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'Commons HopeLend Market',
  HTokenNamePrefix: 'Ethereum',
  StableDebtTokenNamePrefix: 'Ethereum',
  VariableDebtTokenNamePrefix: 'Ethereum',
  SymbolPrefix: 'Eth',
  ProviderId: 8080,
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
    [eEthereumNetwork.rinkeby]: {
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
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
      ltv: '9700',
      liquidationThreshold: '9750',
      liquidationBonus: '10100',
      label: 'Stablecoins',
      assets: ['USDC', 'USDT', 'DAI', 'EURS'],
    },
  },
  L2PoolEnabled: {
    [eArbitrumNetwork.arbitrum]: true,
    [eArbitrumNetwork.görliNitro]: true,
    [eArbitrumNetwork.arbitrumTestnet]: true,
    [eOptimismNetwork.main]: true,
    [eOptimismNetwork.testnet]: true,
  },
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0.5e4,
  },
  HOPEAddress: {
    [eEthereumNetwork.sepolia]: '0x784388A036cb9c8c680002F43354E856f816F844',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  StakingHOPEAddress: {
    [eEthereumNetwork.sepolia]: '0x092c325a98e50BE78A140cD043D49904fFB8Ea1F',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  GaugeControllerAddress: {
    [eEthereumNetwork.sepolia]: '0x89918517C74E7236B38f6fe6969b8262f31D1b73',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: '0x9791ceb0F8483e9Bee77d2c40Eb477df1C377fCd',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  LTAddress: {
    [eEthereumNetwork.sepolia]: '0x0f760D4f644a99962A25Bb7bcF563CC07Bd51b5C',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: '0x10E54A057Ab886b0162ac36369fdcfC6D48D8148',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  BurnerManagerAddress: {
    [eEthereumNetwork.sepolia]: '0x25b6b8497F5614C4A8A255bC091191BC40f16585',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  UnderlyingBurnerAddress: {
    [eEthereumNetwork.sepolia]: '0xdd2a0C2715C7aC7BFafec2D27B13f049C499c8aD',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  Permit2Address: {
    [eEthereumNetwork.sepolia]: '0x914adC3D42F0Cc3eDb613d87b3F5B223B3f789Ae',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
};
