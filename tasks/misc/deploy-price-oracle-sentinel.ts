import { task } from 'hardhat/config';
import {
  ConfigNames,
  FORK,
  deployContract,
  eNetwork,
  getSequencerOracleAddress,
  loadPoolConfig,
} from '../../helpers';
import { POOL_ADDRESSES_PROVIDER_ID } from '../../helpers';
import { PoolAddressesProvider } from '../../typechain';
import { waitForTx } from '../../helpers/utilities/tx';
import { MARKET_NAME } from '../../helpers/env';

/** Chainlink Available networks
You can find proxy addresses for the L2 sequencer feeds at the following addresses:

Arbitrum:
Arbitrum mainnet: 0xFdB631F5EE196F0ed6FAa767959853A9F217697D
Arbitrum Goerli testnet: 0x4da69F028a5790fCCAfe81a75C0D24f46ceCDd69
Optimism:
Optimism mainnet: 0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
Optimism Goerli testnet: 0x4C4814aa04433e0FB31310379a4D6946D5e1D353
BASE:
BASE mainnet: 0xBCF85224fc0756B9Fa45aA7892530B47e10b6433
Metis:
Andromeda mainnet: 0x58218ea7422255EBE94e56b504035a784b7AA204
*/

task(`deploy-price-oracle-sentinel`, `Deploy PriceOracleSentinel`).setAction(async (_, hre) => {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  const sequencerOracleAddress = await getSequencerOracleAddress(poolConfig, network);
  const gracePeriod = poolConfig.gracePeriod;

  if (sequencerOracleAddress == '' || !gracePeriod || gracePeriod == '') {
    console.log('[ERROR] SequencerOracle or GracePeriod not config');
    return;
  }

  const addressesProviderArtifact = await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID);
  const addressesProviderInstance = (await hre.ethers.getContractAt(
    addressesProviderArtifact.abi,
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  const args = [addressesProviderArtifact.address, sequencerOracleAddress, gracePeriod];
  const PriceOracleSentinelContract = await deployContract('PriceOracleSentinel', args);

  await waitForTx(
    await addressesProviderInstance.setPriceOracleSentinel(PriceOracleSentinelContract.address)
  );
  console.log(`[INFO] L2 ${network} config PriceOracleSentinel successful!`);
});
