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
  rateStrategyWETH,
  rateStrategyWstETH,
  rateStrategyUSDT,
  rateStrategyUSDC,
  rateStrategyHOPE,
  rateStrategyStakingHOPE,
  rateStrategyWBTC,
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
      WETH: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
      wstETH: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
      USDT: '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19',
      USDC: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
      HOPE: '0xeF471f9a56FE341981A2330394700B39bc61D589',
      stHOPE: '0xeF471f9a56FE341981A2330394700B39bc61D589',
      WBTC: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    },
    [eEthereumNetwork.goerli]: {
      WETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      wstETH: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      USDT: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      USDC: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7',
      HOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      stHOPE: '0x211f184c1EA0Cf4bB23BFD7a5a432628D90cEa97',
      WBTC: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
    },
    [eEthereumNetwork.main]: {
      WETH: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
      wstETH: '0x260AB2E120683f98BB2cc9f637f7F376e703B308',
      USDT: '0x3e7d1eab13ad0104d2750b8863b489d65364e32d',
      USDC: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
      HOPE: '0x8b434a137bb0a98e126DcE8cA06694BCFa2CB240',
      stHOPE: '0x8b434a137bb0a98e126DcE8cA06694BCFa2CB240',
      WBTC: '0x64C92Fb26FbEea3aeA2473e56Fed74C2Aa889c82',
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
    [eEthereumNetwork.sepolia]: '0x80647A9D0bFA3DB23231E8052ab9708814044cD1',
    [eEthereumNetwork.goerli]: '0x39Dd98E7DA10c48CdBC3D2ad63A36e8c05D982d3',
    [eEthereumNetwork.kovan]: '0x50913E8E1c650E790F8a1E741FF9B1B1bB251dfe',
    [eEthereumNetwork.main]: '0xdFc3d796E16fEDC97e9b843BA4F1c8E5E762F867',
    [eArbitrumNetwork.arbitrum]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrumTestnet]: ZERO_ADDRESS,
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  EModes: {
    // StableEMode: {
    //   id: '1',
    //   ltv: '9700',
    //   liquidationThreshold: '9750',
    //   liquidationBonus: '10100',
    //   label: 'Stablecoins',
    //   assets: ['USDC', 'USDT', 'DAI'],
    // },
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
    rateStrategyWETH,
    rateStrategyWstETH,
    rateStrategyUSDT,
    rateStrategyUSDC,
    rateStrategyHOPE,
    rateStrategyStakingHOPE,
    rateStrategyWBTC,
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: '0xeaB3D0eb85A6052C278Ea1FB7Ed5e699e97B650E',
    [eEthereumNetwork.goerli]: '0xf38F371b16Aa1e3396A64BC03e4995C9B67fb3F3',
    [eEthereumNetwork.main]: '0x94aFb2C17af24cFAcf19f364628F459dfAB2688f',
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: '0x061a7D9E2D8332c0ddb56Af639778aA85A09F71C',
    [eEthereumNetwork.goerli]: '0xD4729aCC86d55925f92d79AEDD50D7B82Ff7eb9A',
    [eEthereumNetwork.main]: '0xe909f37F3003fa37AAd83C1baf2A98E5a7b67400',
  },
  FeeToVaultAddress: {
    [eEthereumNetwork.sepolia]: '0x8b0e0f46Fc96F31a2219feBF599A644d7b096B5c',
    [eEthereumNetwork.goerli]: '0xf8b4976f87Ee3aCd23d4E946C2635A7C8985a259',
    [eEthereumNetwork.main]: '0x93b70B66ce507f49790390F07955940030475cd1',
  },
  ProxyAdminAddress: {
    [eEthereumNetwork.sepolia]: '0xC4f5Ecc8d241C9639efAb2252207DC3c9e4f7690',
    [eEthereumNetwork.goerli]: '0xBED762ED11C5Deab70Ec9C3c037Ca1b195B8F8aF',
    [eEthereumNetwork.main]: '0xcc0f986021010D4A3345CCA903BF5487AEa3bd39',
  },
};
