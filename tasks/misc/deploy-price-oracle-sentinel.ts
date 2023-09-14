import { task } from 'hardhat/config';
import { deployContract } from '../../helpers';
import { POOL_ADDRESSES_PROVIDER_ID } from '../../helpers';
import {  PoolAddressesProvider } from '../../typechain';
import { waitForTx } from '../../helpers/utilities/tx';

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
  const addressesProviderArtifact = await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID);
  const addressesProviderInstance = (await hre.ethers.getContractAt(
    addressesProviderArtifact.abi,
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  const args = [
    addressesProviderArtifact.address,
    //  "0xFdB631F5EE196F0ed6FAa767959853A9F217697D", //Arbitrum mainnet
     "0x4da69F028a5790fCCAfe81a75C0D24f46ceCDd69", //Arbitrum Goerli testnet
     "3600", // grace period, aave use 3600
  ];
  const PriceOracleSentinelContract = await deployContract('PriceOracleSentinel', args);
  console.log(PriceOracleSentinelContract.address);

  await waitForTx(await addressesProviderInstance.setPriceOracleSentinel(PriceOracleSentinelContract.address));
});



