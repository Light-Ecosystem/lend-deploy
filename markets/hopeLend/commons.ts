import {
  AssetType,
  eAvalancheNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  TransferStrategy,
} from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  ICommonConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
} from "../../helpers/types";
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: "Commons HopeLend Market",
  HTokenNamePrefix: "Ethereum",
  StableDebtTokenNamePrefix: "Ethereum",
  VariableDebtTokenNamePrefix: "Ethereum",
  SymbolPrefix: "Eth",
  ProviderId: 8080,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: "USD",
  OracleQuoteUnit: "8",
  WrappedNativeTokenSymbol: "WETH",
  ChainlinkAggregator: {
    [eEthereumNetwork.main]: {
      HOPE: "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
      DAI: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
      LINK: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
      USDC: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      WBTC: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
      WETH: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
      USDT: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
      // Note: EUR/USD, not EURS dedicated oracle
      EURS: "0xb49f677943BC038e9857d61E7d053CaA2C1734C1",
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
    [eEthereumNetwork.kovan]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
    [eEthereumNetwork.main]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
    [eArbitrumNetwork.arbitrumTestnet]:
      "0xeC67987831C4278160D8e652d3edb0Fc45B3766d",
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  FallbackOracle: {
    [eEthereumNetwork.kovan]: "0x50913E8E1c650E790F8a1E741FF9B1B1bB251dfe",
    [eEthereumNetwork.main]: "0x5b09e578cfeaa23f1b11127a658855434e4f3e09",
    [eArbitrumNetwork.arbitrum]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrumTestnet]: ZERO_ADDRESS,
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
      [eArbitrumNetwork.arbitrum]: true,
      [ePolygonNetwork.polygon]: true,
      [eOptimismNetwork.main]: true,
      [eFantomNetwork.main]: true,
      [eHarmonyNetwork.main]: true,
      [eAvalancheNetwork.avalanche]: true,
    },
    rewards: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkHope: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        StkHope: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        StkHope: ZERO_ADDRESS,
      },
    },
    rewardsOracle: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        StkHope: ZERO_ADDRESS,
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        StkHope: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        StkHope: ZERO_ADDRESS,
      },
    },
    incentivesInput: {
      [eArbitrumNetwork.arbitrumTestnet]: [
        {
          emissionPerSecond: "34629756533",
          duration: 7890000,
          asset: "DAI",
          assetType: AssetType.HToken,
          reward: "CRV",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
        {
          emissionPerSecond: "300801036720127500",
          duration: 7890000,
          asset: "USDC",
          assetType: AssetType.HToken,
          reward: "REW",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
        {
          emissionPerSecond: "300801036720127500",
          duration: 7890000,
          asset: "LINK",
          assetType: AssetType.HToken,
          reward: "REW",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
      ],
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9700",
      liquidationThreshold: "9750",
      liquidationBonus: "10100",
      label: "Stablecoins",
      assets: ["USDC", "USDT", "DAI", "EURS"],
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
    total: 0.0005e4,
    protocol: 0.0004e4,
  },
  HOPEAddress: {
    [eEthereumNetwork.sepolia]: "0xeba0e37F77e2ddC6512d6982B5222297Eb3a37D4",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  StakingHOPEAddress: {
    [eEthereumNetwork.sepolia]: "0xeba0e37F77e2ddC6512d6982B5222297Eb3a37D4",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  GaugeControllerAddress: {
    [eEthereumNetwork.sepolia]: "0xeba0e37F77e2ddC6512d6982B5222297Eb3a37D4",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  MinterAddress: {
    [eEthereumNetwork.sepolia]: "0x4BDB0F69f233C02bd82d5e5fBdF7e6F206E9FdE5",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  LTAddress: {
    [eEthereumNetwork.sepolia]: "0x6EC9cA983B57e9eE89fC06Fa4AC0dC0213fe155E",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  VotingEscrowAddress: {
    [eEthereumNetwork.sepolia]: "0xcb4DD14E9b4899f582E7aD7826431e0411B2C59e",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  BurnerManagerAddress: {
    [eEthereumNetwork.sepolia]: "0x9bA97e0913Dd0fbd4E5fedA936db9D1f1C632273",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  UnderlyingBurnerAddress: {
    [eEthereumNetwork.sepolia]: "0xaAfAa8d21eCDE9cD8C150cAA93413AaDc604D88a",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  },
  Permit2Address: {
    [eEthereumNetwork.sepolia]: "0x5aB6249458227De13a2384bBeA5E231Cab2f5723",
    [eEthereumNetwork.goerli]: "",
    [eEthereumNetwork.main]: "",
  }
};
