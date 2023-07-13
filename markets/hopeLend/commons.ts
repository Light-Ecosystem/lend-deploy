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
      DAI: '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19',
      LINK: '0xCe8021185636595EcedE301f75bf9D91ABE7DD9e',
      USDC: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
      WBTC: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
      WETH: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
      USDT: '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19',
      HOPE: '0xFaf5730c9a83292Ae261EdA1285Ec2F564d49F91',
      StakingHOPE: '0xFaf5730c9a83292Ae261EdA1285Ec2F564d49F91',
      EURS: '0x0fc0080B1b87deD9E0Cb6611169D33CeeD908Cc8',
    },
    [eEthereumNetwork.goerli]: {
      DAI: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      USDC: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7',
      WETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      USDT: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      HOPE: '0x99f4E627093D6Bba806ea18284fB5C5EA1De6753',
      StakingHOPE: '0x99f4E627093D6Bba806ea18284fB5C5EA1De6753',
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
    [eArbitrumNetwork.arbitrumTestnet]: '0xeC67987831C4278160D8e652d3edb0Fc45B3766d',
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  FallbackOracle: {
    [eEthereumNetwork.sepolia]: '0xA41Ca5f62A45a44239973C360060bFF14DF45119',
    [eEthereumNetwork.goerli]: '0x2f4dabf7272178fD3DDA1523aacDcA58399A190f',
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
    protocol: 0.3e4,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: '0x2DD369a0126B014f5A574f92FB5510B4EaB4eF01',
    [eEthereumNetwork.goerli]: '0x3c2AB5E5D31872B920497bD787cFFAba9fB3615A',
    [eEthereumNetwork.main]: '',
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: '0x04d7D7ffa4ECFC3280ACF8508e9122dfD16e3A75',
    [eEthereumNetwork.goerli]: '0x4BDB0F69f233C02bd82d5e5fBdF7e6F206E9FdE5',
    [eEthereumNetwork.main]: '',
  },
  FeeToVaultAddress: {
    [eEthereumNetwork.sepolia]: '0xF10121e7afdc3F1e55912246a8eE87711823a802',
    [eEthereumNetwork.goerli]: '0x4c481663D8d0b338760c5189807f46e0a7db58f2',
    [eEthereumNetwork.main]: '',
  },
  ProxyAdminAddress: {
    [eEthereumNetwork.sepolia]: '0x424008a0c704697DA09b94c562cF53db8C07CD8A',
    [eEthereumNetwork.goerli]: '0x9287Df5C18C4AfF42581e868D4D8f903Ee9E923a',
    [eEthereumNetwork.main]: '0xcc0f986021010D4A3345CCA903BF5487AEa3bd39',
  },
};
