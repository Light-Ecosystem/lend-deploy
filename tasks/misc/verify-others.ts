import { task } from 'hardhat/config';
import {
  eNetwork,
  getAddressFromJson,
  getFlashLoanLogic,
  getPoolConfiguratorImpl,
  getPoolImpl,
  POOL_IMPL_ID,
  POOL_CONFIGURATOR_IMPL_ID,
  getPoolAddressesProvider,
  POOL_ADDRESSES_PROVIDER_ID,
  getPoolProxy,
  POOL_PROXY_ID,
  RESERVES_SETUP_HELPER_ID,
  L2_POOL_IMPL_ID,
} from '../../helpers';

task(`verify-others`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
  const network = hre.network.name as eNetwork;
  const flashLoanLogic = await getFlashLoanLogic(
    await getAddressFromJson(network, 'FlashLoanLogic')
  );
  const poolProxy = await getPoolProxy(await getAddressFromJson(network, POOL_PROXY_ID));
  const poolImpl = await getPoolImpl(await getAddressFromJson(network, L2_POOL_IMPL_ID));
  const poolConfiguratorImpl = await getPoolConfiguratorImpl(
    await getAddressFromJson(network, POOL_CONFIGURATOR_IMPL_ID)
  );
  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
  );
  const reservesSetupHelper = await getPoolProxy(
    await getAddressFromJson(network, RESERVES_SETUP_HELPER_ID)
  );
  try {
    await hre.run('verify:verify', {
      contract: 'CalldataLogic',
      address: '0xC2656A1fdeaCd2458d8f3e640fcCE9f52237e76A',
      constructorArguments: [],
    });
  } catch (error) {
    console.error(error);
  }
  return;
  console.log(`- Verifying FlashLoanLogic:`);
  try {
    await hre.run('verify:verify', {
      address: flashLoanLogic.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(error);
  }
  console.log(`- Verifying Pool Implementation:`);
  try {
    await hre.run('verify:verify', {
      address: poolImpl.address,
      constructorArguments: [poolAddressesProvider.address],
    });
  } catch (error) {
    console.error(error);
  }
  console.log(`- Verifying PoolConfigurator Implementation:`);
  try {
    await hre.run('verify:verify', {
      address: poolConfiguratorImpl.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(error);
  }
  console.log(`- Verifying Pool Proxy:`);
  try {
    await hre.run('verify:verify', {
      address: poolProxy.address,
      constructorArguments: [poolAddressesProvider.address],
    });
  } catch (error) {
    console.error(error);
  }
  console.log(`- Verifying ReservesSetupHelper:`);
  try {
    await hre.run('verify:verify', {
      address: reservesSetupHelper.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(error);
  }
});
