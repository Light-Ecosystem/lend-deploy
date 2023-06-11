import {
  DETERMINISTIC_DEPLOYMENT,
  DETERMINISTIC_FACTORIES,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
} from './helpers/hardhat-config-helpers';
import {
  eArbitrumNetwork,
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
      {
        version: '0.8.17',
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
        },
      },
    ],
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  networks: {
    hardhat: hardhatNetworkSettings,
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
    arbitrum: getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
    [eArbitrumNetwork.arbitrumTestnet]: getCommonNetworkConfig(
      eArbitrumNetwork.arbitrumTestnet,
      421611
    ),
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
    [eArbitrumNetwork.görliNitro]: getCommonNetworkConfig(eArbitrumNetwork.görliNitro, 421613),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  dependencyCompiler: {
    paths: [
      'lend-core/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol',
      'lend-core/contracts/protocol/configuration/PoolAddressesProvider.sol',
      'lend-core/contracts/misc/HopeOracle.sol',
      'lend-core/contracts/protocol/tokenization/HToken.sol',
      'lend-core/contracts/protocol/tokenization/StableDebtToken.sol',
      'lend-core/contracts/protocol/tokenization/VariableDebtToken.sol',
      'lend-core/contracts/protocol/libraries/logic/GenericLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/ValidationLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/ReserveLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/SupplyLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/EModeLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/BorrowLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/BridgeLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/FlashLoanLogic.sol',
      'lend-core/contracts/protocol/libraries/logic/CalldataLogic.sol',
      'lend-core/contracts/protocol/pool/Pool.sol',
      'lend-core/contracts/protocol/pool/L2Pool.sol',
      'lend-core/contracts/protocol/pool/PoolConfigurator.sol',
      'lend-core/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol',
      'lend-core/contracts/protocol/libraries/hopelend-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol',
      'lend-core/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol',
      'lend-core/contracts/deployments/ReservesSetupHelper.sol',
      'lend-core/contracts/misc/HopeLendProtocolDataProvider.sol',
      'lend-core/contracts/misc/L2Encoder.sol',
      'lend-core/contracts/protocol/configuration/ACLManager.sol',
      'lend-core/contracts/protocol/gauge/LendingGauge.sol',
      'lend-core/contracts/protocol/gauge/GaugeFactory.sol',
      'lend-core/contracts/dependencies/weth/WETH9.sol',
      'lend-core/contracts/mocks/helpers/MockReserveConfiguration.sol',
      'lend-core/contracts/mocks/oracle/CLAggregators/MockAggregator.sol',
      'lend-core/contracts/mocks/tokens/MintableERC20.sol',
      'lend-core/contracts/mocks/flashloan/MockFlashLoanReceiver.sol',
      'lend-core/contracts/mocks/tokens/WETH9Mocked.sol',
      'lend-core/contracts/mocks/upgradeability/MockVariableDebtToken.sol',
      'lend-core/contracts/mocks/upgradeability/MockHToken.sol',
      'lend-core/contracts/mocks/upgradeability/MockStableDebtToken.sol',
      'lend-core/contracts/mocks/upgradeability/MockInitializableImplementation.sol',
      'lend-core/contracts/mocks/helpers/MockPool.sol',
      'lend-core/contracts/mocks/helpers/MockL2Pool.sol',
      'lend-core/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol',
      'lend-core/contracts/mocks/oracle/PriceOracle.sol',
      'lend-core/contracts/mocks/tokens/MintableDelegationERC20.sol',
      'lend-periphery/contracts/misc/UiPoolDataProvider.sol',
      'lend-periphery/contracts/misc/WalletBalanceProvider.sol',
      'lend-periphery/contracts/misc/WrappedTokenGateway.sol',
      'lend-periphery/contracts/misc/interfaces/IWETH.sol',
      'lend-periphery/contracts/treasury/HopeLendEcosystemReserveV2.sol',
      'lend-periphery/contracts/treasury/HopeLendEcosystemReserveController.sol',
    ],
  },
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT ? DETERMINISTIC_FACTORIES : undefined,
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
