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
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from './rateStrategies';
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
    [eEthereumNetwork.sepolia]: {
      DAI: '0x69Fd56D592Bb24481d8511cf430333542C539A7d',
      LINK: '0xCe8021185636595EcedE301f75bf9D91ABE7DD9e',
      USDC: '0x67A5Eb021116db0ADED617F4De3923a8fbA1D17b',
      WBTC: '0xa49916295f54Df0F93101D7347588e84f4de14C7',
      WETH: '0x53c124838885a84D4316F6a94067b52bB9F1b682',
      USDT: '0x4D1c362927B4D94EfCf0793319140a27B00F4347',
      HOPE: '0x7b8b1caE2A18D785d0B441Fee221D0A3a0fBbBD6',
      StakingHOPE: '0xCB353A5dAb39Aef0867b7B415a48A4cCed10C48d',
      EURS: '0x0fc0080B1b87deD9E0Cb6611169D33CeeD908Cc8',
    },
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
      assets: ['USDC', 'USDT', 'DAI'],
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
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  HOPEAddress: {
    [eEthereumNetwork.sepolia]: '0x70C8C67CfbE228c7437Ec586a751a408e23355F4',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  StakingHOPEAddress: {
    [eEthereumNetwork.sepolia]: '0x03D69A55579496821D8FdF0769F0C1a4A195788A',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  GaugeControllerAddress: {
    [eEthereumNetwork.sepolia]: '0x405604a1F28e89B736353016CF504Fe26C0E32Df',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: '0x2DD369a0126B014f5A574f92FB5510B4EaB4eF01',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  LTAddress: {
    [eEthereumNetwork.sepolia]: '0xC0f5ee5C2e6E830d114BFAAecE310c7625C0EF00',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: '0x04d7D7ffa4ECFC3280ACF8508e9122dfD16e3A75',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  BurnerManagerAddress: {
    [eEthereumNetwork.sepolia]: '0x1549105D87e08A543897f7F70aEE00dA85b091D2',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  UnderlyingBurnerAddress: {
    [eEthereumNetwork.sepolia]: '0xE12fc8E54cDd8b2A8c73CB39e412d08Bf7448FC6',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  Permit2Address: {
    [eEthereumNetwork.sepolia]: '0xf3a2BD652E6d90B2f330c8450E2E85734336Eb54',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  FeeToVaultAddress: {
    [eEthereumNetwork.sepolia]: '0xF10121e7afdc3F1e55912246a8eE87711823a802',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '',
  },
  ProxyAdminAddress: {
    [eEthereumNetwork.sepolia]: '0x424008a0c704697DA09b94c562cF53db8C07CD8A',
    [eEthereumNetwork.goerli]: '',
    [eEthereumNetwork.main]: '0xcc0f986021010D4A3345CCA903BF5487AEa3bd39',
  },
};
