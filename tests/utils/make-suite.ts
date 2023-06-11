import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { Signer } from "ethers";
import { evmRevert, evmSnapshot } from "../../helpers/utilities/tx";
import { tEthereumAddress } from "../../helpers/types";
import { Pool } from "../../typechain";
import { HopeLendProtocolDataProvider } from "../../typechain";
import { HToken } from "../../typechain";
import { PoolConfigurator } from "../../typechain";

import chai from "chai";
import { PoolAddressesProvider } from "../../typechain";
import { PoolAddressesProviderRegistry } from "../../typechain";
import {
  HopeOracle,
  ERC20Faucet,
  IERC20,
  StableDebtToken,
  VariableDebtToken,
  WETH9,
  WrappedTokenGateway
} from "../../typechain";
import {
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_DATA_PROVIDER,
  POOL_PROXY_ID
} from "../../helpers/deploy-ids";
import {
  getHToken,
  getERC20,
  getERC20Faucet,
  getStableDebtToken,
  getVariableDebtToken,
  getWETH
} from "../../helpers/contract-getters";

import { ethers, deployments } from "hardhat";
import { getEthersSigners } from "../../helpers/utilities/signer";
import { MARKET_NAME } from "../../helpers/env";

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  deployer: SignerWithAddress;
  poolAdmin: SignerWithAddress;
  emergencyAdmin: SignerWithAddress;
  riskAdmin: SignerWithAddress;
  users: SignerWithAddress[];
  pool: Pool;
  configurator: PoolConfigurator;
  oracle: HopeOracle;
  helpersContract: HopeLendProtocolDataProvider;
  weth: WETH9;
  hWETH: HToken;
  dai: IERC20;
  hDai: HToken;
  variableDebtDai: VariableDebtToken;
  stableDebtDai: StableDebtToken;
  hUsdc: HToken;
  usdc: IERC20;
  hope: IERC20;
  addressesProvider: PoolAddressesProvider;
  registry: PoolAddressesProviderRegistry;
  wrappedTokenGateway: WrappedTokenGateway;
  faucet: ERC20Faucet;
}

let HardhatSnapshotId: string = "0x1";
const setHardhatSnapshotId = (id: string) => {
  HardhatSnapshotId = id;
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  poolAdmin: {} as SignerWithAddress,
  emergencyAdmin: {} as SignerWithAddress,
  riskAdmin: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  pool: {} as Pool,
  configurator: {} as PoolConfigurator,
  helpersContract: {} as HopeLendProtocolDataProvider,
  oracle: {} as HopeOracle,
  weth: {} as WETH9,
  hWETH: {} as HToken,
  dai: {} as IERC20,
  hDai: {} as HToken,
  variableDebtDai: {} as VariableDebtToken,
  stableDebtDai: {} as StableDebtToken,
  hUsdc: {} as HToken,
  usdc: {} as IERC20,
  hope: {} as IERC20,
  addressesProvider: {} as PoolAddressesProvider,
  registry: {} as PoolAddressesProviderRegistry,
  wrappedTokenGateway: {} as WrappedTokenGateway,
  faucet: {} as ERC20Faucet,
} as TestEnv;

export async function initializeMakeSuite() {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }

  const wrappedTokenGatewayArtifact = await deployments.get(
    "WrappedTokenGateway"
  );
  const poolArtifact = await deployments.get(POOL_PROXY_ID);
  const configuratorArtifact = await deployments.get(
    POOL_CONFIGURATOR_PROXY_ID
  );
  const addressesProviderArtifact = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const addressesProviderRegistryArtifact = await deployments.get(
    "PoolAddressesProviderRegistry"
  );
  const priceOracleArtifact = await deployments.get(ORACLE_ID);
  const dataProviderArtifact = await deployments.get(POOL_DATA_PROVIDER);

  testEnv.deployer = deployer;
  testEnv.poolAdmin = deployer;
  testEnv.emergencyAdmin = testEnv.users[1];
  testEnv.riskAdmin = testEnv.users[2];
  testEnv.wrappedTokenGateway = (await ethers.getContractAt(
    "WrappedTokenGateway",
    wrappedTokenGatewayArtifact.address
  )) as WrappedTokenGateway;
  testEnv.pool = (await ethers.getContractAt(
    "Pool",
    poolArtifact.address
  )) as Pool;

  testEnv.configurator = (await ethers.getContractAt(
    "PoolConfigurator",
    configuratorArtifact.address
  )) as PoolConfigurator;

  testEnv.addressesProvider = (await ethers.getContractAt(
    "PoolAddressesProvider",
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  testEnv.registry = (await ethers.getContractAt(
    "PoolAddressesProviderRegistry",
    addressesProviderRegistryArtifact.address
  )) as PoolAddressesProviderRegistry;
  testEnv.oracle = (await ethers.getContractAt(
    "HopeOracle",
    priceOracleArtifact.address
  )) as HopeOracle;

  testEnv.helpersContract = (await ethers.getContractAt(
    dataProviderArtifact.abi,
    dataProviderArtifact.address
  )) as HopeLendProtocolDataProvider;

  const allTokens = await testEnv.helpersContract.getAllHTokens();
  const hDaiAddress = allTokens.find(
    (hToken) => hToken.symbol === "aEthDAI"
  )?.tokenAddress;
  const hUsdcAddress = allTokens.find(
    (hToken) => hToken.symbol === "aEthUSDC"
  )?.tokenAddress;

  const hWEthAddress = allTokens.find(
    (hToken) => hToken.symbol === "aEthWETH"
  )?.tokenAddress;

  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  const daiAddress = reservesTokens.find(
    (token) => token.symbol === "DAI"
  )?.tokenAddress;
  const {
    variableDebtTokenAddress: variableDebtDaiAddress,
    stableDebtTokenAddress: stableDebtDaiAddress,
  } = await testEnv.helpersContract.getReserveTokensAddresses(daiAddress || "");
  const usdcAddress = reservesTokens.find(
    (token) => token.symbol === "USDC"
  )?.tokenAddress;
  const hopeAddress = reservesTokens.find(
    (token) => token.symbol === "HOPE"
  )?.tokenAddress;
  const wethAddress = reservesTokens.find(
    (token) => token.symbol === "WETH"
  )?.tokenAddress;

  if (!hDaiAddress || !hWEthAddress || !hUsdcAddress) {
    process.exit(1);
  }
  if (!daiAddress || !usdcAddress || !hopeAddress || !wethAddress) {
    process.exit(1);
  }

  testEnv.hDai = await getHToken(hDaiAddress);
  testEnv.variableDebtDai = await getVariableDebtToken(variableDebtDaiAddress);
  testEnv.stableDebtDai = await getStableDebtToken(stableDebtDaiAddress);
  testEnv.hUsdc = await getHToken(hUsdcAddress);
  testEnv.hWETH = await getHToken(hWEthAddress);

  testEnv.dai = await getERC20(daiAddress);
  testEnv.usdc = await getERC20(usdcAddress);
  testEnv.hope = await getERC20(hopeAddress);
  testEnv.weth = await getWETH(wethAddress);

  if (isTestnetMarket(poolConfig)) {
    testEnv.faucet = await getERC20Faucet();
  }
}

const setSnapshot = async () => {
  setHardhatSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  await evmRevert(HardhatSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      await setSnapshot();
    });
    tests(testEnv);
    after(async () => {
      await revertHead();
    });
  });
}
