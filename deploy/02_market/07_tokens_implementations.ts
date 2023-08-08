import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import {
  HTOKEN_IMPL_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  STABLE_DEBT_TOKEN_IMPL_ID,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
} from '../../helpers/deploy-ids';
import { HToken, PoolAddressesProvider, StableDebtToken, VariableDebtToken } from '../../typechain';
import { CORE_VERSION, ZERO_ADDRESS } from '../../helpers/constants';
import { getContract, waitForTx } from '../../helpers';
import { MARKET_NAME } from '../../helpers/env';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address: addressesProvider } = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const addressesProviderInstance = (await getContract(
    'PoolAddressesProvider',
    addressesProvider
  )) as PoolAddressesProvider;

  const poolAddress = await addressesProviderInstance.getPool();

  const hTokenArtifact = await deploy(HTOKEN_IMPL_ID, {
    contract: 'HToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const hToken = (await hre.ethers.getContractAt(
    hTokenArtifact.abi,
    hTokenArtifact.address
  )) as HToken;
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

  const stableDebtTokenArtifact = await deploy(STABLE_DEBT_TOKEN_IMPL_ID, {
    contract: 'StableDebtToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const stableDebtToken = (await hre.ethers.getContractAt(
    stableDebtTokenArtifact.abi,
    stableDebtTokenArtifact.address
  )) as StableDebtToken;
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

  const variableDebtTokenArtifact = await deploy(VARIABLE_DEBT_TOKEN_IMPL_ID, {
    contract: 'VariableDebtToken',
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const variableDebtToken = (await hre.ethers.getContractAt(
    variableDebtTokenArtifact.abi,
    variableDebtTokenArtifact.address
  )) as VariableDebtToken;
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

  return true;
};

func.id = `TokenImplementations:${MARKET_NAME}:@hopelend/core@${CORE_VERSION}`;

func.tags = ['market', 'tokens'];

export default func;
