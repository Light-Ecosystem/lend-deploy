import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import {
  ConfigNames,
  L2_ENCODER,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_PROXY_ID,
  PRICE_ORACLE_SENTINEL,
  PoolAddressesProvider,
  eNetwork,
  getSequencerOracleAddress,
  isL2PoolSupported,
  loadPoolConfig,
  waitForTx,
} from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  if (!isL2PoolSupported(poolConfig)) {
    console.log(
      `[INFO] Skipped Encoder & Sequencer due current network '${network}' is not supported`
    );
  }

  const { address: poolProxyAddress } = await deployments.get(POOL_PROXY_ID);
  const addressesProviderArtifact = await deployments.get(POOL_ADDRESSES_PROVIDER_ID);

  const sequencerOracleAddress = await getSequencerOracleAddress(poolConfig, network);
  const gracePeriod = poolConfig.GracePeriod;

  if (sequencerOracleAddress == '' || !gracePeriod || gracePeriod == '') {
    console.log('[ERROR] SequencerOracle or GracePeriod not config');
    return;
  }

  await deploy(L2_ENCODER, {
    from: deployer,
    contract: 'L2Encoder',
    args: [poolProxyAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const priceOracleSentinelArtifact = await deploy(PRICE_ORACLE_SENTINEL, {
    from: deployer,
    contract: 'PriceOracleSentinel',
    args: [addressesProviderArtifact.address, sequencerOracleAddress, gracePeriod],
    ...COMMON_DEPLOY_PARAMS,
  });

  const addressesProviderInstance = (await hre.ethers.getContractAt(
    addressesProviderArtifact.abi,
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  await waitForTx(
    await addressesProviderInstance.setPriceOracleSentinel(priceOracleSentinelArtifact.address)
  );
  console.log(`[INFO] L2 ${network} config PriceOracleSentinel successful!`);
  return true;
};

func.id = `L2Encoder-Sequencer`;
func.tags = ['periphery-post'];

export default func;
