import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import {
  HTOKEN_UPGRADE_IMPL_ID,
  VARIABLE_DEBT_TOKEN_UPGRADE_IMPL_ID,
  STABLE_DEBT_TOKEN_UPGRADE_IMPL_ID,
  POOL_UPGRADE_IMPL_ID,
  TREASURY_UPGRADE_IMPL_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_UPGRADE_IMPL_ID,
} from '../../helpers/deploy-ids';
import {
  MockHToken,
  MockStableDebtToken,
  MockVariableDebtToken,
  MockPoolV2,
  MockPoolConfiguratorV2,
  MockHopeLendEcosystemReserveV2,
} from '../../typechain';
import { CORE_VERSION, ZERO_ADDRESS } from '../../helpers/constants';
import { getPoolAddressesProvider, getPoolLibraries, waitForTx } from '../../helpers';
import { MARKET_NAME } from '../../helpers/env';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (process.env.UPGRADEABILITY !== 'true') {
    return;
  }

  const { address: addressesProvider } = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const addressesProviderInstance = await getPoolAddressesProvider();

  const poolAddress = await addressesProviderInstance.getPool();

  const hTokenArtifact = await deploy(HTOKEN_UPGRADE_IMPL_ID, {
    contract: 'MockHToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const hToken = (await hre.ethers.getContractAt(
    hTokenArtifact.abi,
    hTokenArtifact.address
  )) as MockHToken;
  await waitForTx(
    await hToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // treasury
      ZERO_ADDRESS, // underlyingAsset
      0, // hTokenDecimals
      'HTOKEN_IMPL', // hTokenName
      'HTOKEN_IMPL', // hTokenSymbol
      '0x00' // params
    )
  );

  const stableDebtTokenArtifact = await deploy(STABLE_DEBT_TOKEN_UPGRADE_IMPL_ID, {
    contract: 'MockStableDebtToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const stableDebtToken = (await hre.ethers.getContractAt(
    stableDebtTokenArtifact.abi,
    stableDebtTokenArtifact.address
  )) as MockStableDebtToken;
  await waitForTx(
    await stableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      0, // debtTokenDecimals
      'STABLE_DEBT_TOKEN_IMPL', // debtTokenName
      'STABLE_DEBT_TOKEN_IMPL', // debtTokenSymbol
      '0x00' // params
    )
  );

  const variableDebtTokenArtifact = await deploy(VARIABLE_DEBT_TOKEN_UPGRADE_IMPL_ID, {
    contract: 'MockVariableDebtToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const variableDebtToken = (await hre.ethers.getContractAt(
    variableDebtTokenArtifact.abi,
    variableDebtTokenArtifact.address
  )) as MockVariableDebtToken;
  await waitForTx(
    await variableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      0, // debtTokenDecimals
      'VARIABLE_DEBT_TOKEN_IMPL', // debtTokenName
      'VARIABLE_DEBT_TOKEN_IMPL', // debtTokenSymbol
      '0x00' // params
    )
  );

  const commonLibraries = await getPoolLibraries();
  const poolArtifact = await deploy(POOL_UPGRADE_IMPL_ID, {
    contract: 'MockPoolV2',
    from: deployer,
    args: [addressesProvider],
    libraries: {
      ...commonLibraries,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  const pool = (await hre.ethers.getContractAt(
    poolArtifact.abi,
    poolArtifact.address
  )) as MockPoolV2;
  await waitForTx(await pool.initialize(addressesProvider));

  const configuratorLogicArtifact = await deployments.get('ConfiguratorLogic');
  const poolConfiguratorArtifact = await deploy(POOL_CONFIGURATOR_UPGRADE_IMPL_ID, {
    contract: 'MockPoolConfiguratorV2',
    from: deployer,
    args: [],
    libraries: {
      ConfiguratorLogic: configuratorLogicArtifact.address,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  const poolConfigurator = (await hre.ethers.getContractAt(
    poolConfiguratorArtifact.abi,
    poolConfiguratorArtifact.address
  )) as MockPoolConfiguratorV2;
  await waitForTx(await poolConfigurator.initialize(addressesProvider));

  const treasuryArtifact = await deploy(TREASURY_UPGRADE_IMPL_ID, {
    contract: 'MockHopeLendEcosystemReserveV2',
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  const treasury = (await hre.ethers.getContractAt(
    treasuryArtifact.abi,
    treasuryArtifact.address
  )) as MockHopeLendEcosystemReserveV2;
  await waitForTx(await treasury.initialize(ZERO_ADDRESS));

  return true;
};

func.id = `UpgradeImplementations:${MARKET_NAME}:@hopelend/core@${CORE_VERSION}`;

func.tags = ['upgrades'];

export default func;
