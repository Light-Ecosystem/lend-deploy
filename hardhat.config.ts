import {
  ARBISCAN_KEY,
  BASESCAN_KEY,
  DETERMINISTIC_DEPLOYMENT,
  DETERMINISTIC_FACTORIES,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
} from './helpers/hardhat-config-helpers';
import {
  eArbitrumNetwork,
  eBaseNetwork,
  eAvalancheNetwork,
  eEthereumNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  eTenderly,
} from './helpers/types';
import { DEFAULT_NAMED_ACCOUNTS } from './helpers/constants';

import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import 'hardhat-dependency-compiler';
import 'hardhat-abi-exporter';
import '@nomiclabs/hardhat-ethers';
// @ts-ignore
import { accounts } from './test-wallets.js';

const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
const TASK_FOLDERS = ['misc', 'market-registry'];

// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
  loadTasks(TASK_FOLDERS);
}

export default {
  abiExporter: {
    path: './abi', // path to ABI export directory (relative to Hardhat root)
    runOnCompile: true, // whether to automatically export ABIs during compilation
    clear: true, // whether to delete old ABI files in path on compilation
    flat: true, // whether to flatten output directory (may cause name collisions)
    pretty: false, // whether to use interface-style formatting of output for better readability
    except: ['@openzeppelin/contracts/token/ERC20/IERC20.sol'],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
          evmVersion: 'berlin',
        },
      },
    ],
    overrides: {
      '@hopelend/core/contracts/protocol/pool/L2Pool.sol': {
        version: '0.8.17',
        settings: {
          optimizer: { enabled: true, runs: 30_000 },
          evmVersion: 'berlin',
        },
      },
      '@hopelend/core/contracts/mocks/helpers/MockL2Pool.sol': {
        version: '0.8.17',
        settings: {
          optimizer: { enabled: true, runs: 30_000 },
          evmVersion: 'berlin',
        },
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  networks: {
    hardhat: {
      ...hardhatNetworkSettings,
      // accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
      //   privateKey: secretKey,
      //   balance,
      // })),
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      ...hardhatNetworkSettings,
    },
    tenderly: getCommonNetworkConfig('tenderly', 3030),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    rinkeby: getCommonNetworkConfig(eEthereumNetwork.rinkeby, 4),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),
    [ePolygonNetwork.polygon]: getCommonNetworkConfig(ePolygonNetwork.polygon, 137),
    [ePolygonNetwork.mumbai]: getCommonNetworkConfig(ePolygonNetwork.mumbai, 80001),
    arbitrum: {
      ...getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
      verify: {
        etherscan: {
          apiKey: ARBISCAN_KEY,
        },
      },
    },
    [eArbitrumNetwork.arbitrumGoerli]: {
      ...getCommonNetworkConfig(eArbitrumNetwork.arbitrumGoerli, 421613),
      verify: {
        etherscan: {
          apiKey: ARBISCAN_KEY,
        },
      },
    },
    base: {
      ...getCommonNetworkConfig(eBaseNetwork.base, 8453),
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org',
          apiKey: BASESCAN_KEY,
        },
      },
    },
    [eBaseNetwork.baseGoerli]: {
      ...getCommonNetworkConfig(eBaseNetwork.baseGoerli, 84531),
      verify: {
        etherscan: {
          apiUrl: 'https://api-goerli.basescan.org',
          apiKey: BASESCAN_KEY,
        },
      },
    },
    [eHarmonyNetwork.main]: getCommonNetworkConfig(eHarmonyNetwork.main, 1666600000),
    [eHarmonyNetwork.testnet]: getCommonNetworkConfig(eHarmonyNetwork.testnet, 1666700000),
    [eAvalancheNetwork.avalanche]: getCommonNetworkConfig(eAvalancheNetwork.avalanche, 43114),
    [eAvalancheNetwork.fuji]: getCommonNetworkConfig(eAvalancheNetwork.fuji, 43113),
    [eFantomNetwork.main]: getCommonNetworkConfig(eFantomNetwork.main, 250),
    [eFantomNetwork.testnet]: getCommonNetworkConfig(eFantomNetwork.testnet, 4002),
    [eOptimismNetwork.testnet]: getCommonNetworkConfig(eOptimismNetwork.testnet, 420),
    [eOptimismNetwork.main]: getCommonNetworkConfig(eOptimismNetwork.main, 10),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(eEthereumNetwork.sepolia, 11155111),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  dependencyCompiler: {
    paths: [
      '@hopelend/core/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol',
      '@hopelend/core/contracts/protocol/configuration/PoolAddressesProvider.sol',
      '@hopelend/core/contracts/misc/HopeOracle.sol',
      '@hopelend/core/contracts/protocol/tokenization/HToken.sol',
      '@hopelend/core/contracts/protocol/tokenization/StableDebtToken.sol',
      '@hopelend/core/contracts/protocol/tokenization/VariableDebtToken.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/GenericLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/ValidationLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/ReserveLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/SupplyLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/EModeLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/BorrowLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/BridgeLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/FlashLoanLogic.sol',
      '@hopelend/core/contracts/protocol/libraries/logic/CalldataLogic.sol',
      '@hopelend/core/contracts/protocol/pool/Pool.sol',
      '@hopelend/core/contracts/protocol/pool/L2Pool.sol',
      '@hopelend/core/contracts/protocol/pool/PoolConfigurator.sol',
      '@hopelend/core/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol',
      '@hopelend/core/contracts/protocol/libraries/hopelend-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol',
      '@hopelend/core/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol',
      '@hopelend/core/contracts/deployments/ReservesSetupHelper.sol',
      '@hopelend/core/contracts/misc/HopeLendProtocolDataProvider.sol',
      '@hopelend/core/contracts/misc/L2Encoder.sol',
      '@hopelend/core/contracts/protocol/configuration/ACLManager.sol',
      '@hopelend/core/contracts/protocol/gauge/LendingGauge.sol',
      '@hopelend/core/contracts/protocol/gauge/GaugeFactory.sol',
      '@hopelend/core/contracts/dependencies/weth/WETH9.sol',
      '@hopelend/core/contracts/mocks/helpers/MockReserveConfiguration.sol',
      '@hopelend/core/contracts/mocks/oracle/CLAggregators/MockAggregator.sol',
      '@hopelend/core/contracts/mocks/tokens/MintableERC20.sol',
      '@hopelend/core/contracts/mocks/flashloan/MockFlashLoanReceiver.sol',
      '@hopelend/core/contracts/mocks/tokens/WETH9Mocked.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockPoolV2.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockPoolConfiguratorV2.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockVariableDebtToken.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockHToken.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockStableDebtToken.sol',
      '@hopelend/core/contracts/mocks/upgradeability/MockInitializableImplementation.sol',
      '@hopelend/core/contracts/mocks/helpers/MockPool.sol',
      '@hopelend/core/contracts/mocks/helpers/MockL2Pool.sol',
      '@hopelend/core/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol',
      '@hopelend/core/contracts/mocks/oracle/PriceOracle.sol',
      '@hopelend/core/contracts/mocks/tokens/MintableDelegationERC20.sol',
      '@hopelend/core/contracts/protocol/tokenization/L2HToken.sol',
      '@hopelend/core/contracts/protocol/tokenization/L2StableDebtToken.sol',
      '@hopelend/core/contracts/protocol/tokenization/L2VariableDebtToken.sol',
      '@hopelend/core/contracts/mocks/helpers/MockL2HToken.sol',
      '@hopelend/core/contracts/mocks/helpers/MockL2VariableDebtToken.sol',
      '@hopelend/core/contracts/mocks/helpers/MockL2StableDebtToken.sol',
      '@hopelend/core/contracts/protocol/configuration/PriceOracleSentinel.sol',
      '@hopelend/periphery/contracts/misc/UiPoolDataProvider.sol',
      '@hopelend/periphery/contracts/misc/WalletBalanceProvider.sol',
      '@hopelend/periphery/contracts/misc/WrappedTokenGateway.sol',
      '@hopelend/periphery/contracts/misc/interfaces/IWETH.sol',
      '@hopelend/periphery/contracts/treasury/HopeLendEcosystemReserve.sol',
      '@hopelend/periphery/contracts/treasury/HopeLendEcosystemReserveController.sol',
      '@hopelend/periphery/contracts/mocks/upgradeability/MockHopeLendEcosystemReserveV2.sol',
    ],
  },
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT ? DETERMINISTIC_FACTORIES : undefined,
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_KEY,
      sepolia: ETHERSCAN_KEY,
      goerli: ETHERSCAN_KEY,
      arbitrumOne: ARBISCAN_KEY,
      arbitrumGoerli: ARBISCAN_KEY,
      base: BASESCAN_KEY,
      baseGoerli: BASESCAN_KEY,
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'baseGoerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org',
        },
      },
    ],
  },
};
