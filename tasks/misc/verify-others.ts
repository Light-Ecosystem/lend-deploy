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
} from '../../helpers';

task(`verify-others`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
  const network = hre.network.name as eNetwork;
  const flashLoanLogic = await getFlashLoanLogic(
    await getAddressFromJson(network, 'FlashLoanLogic')
  );
  const poolImpl = await getPoolImpl(await getAddressFromJson(network, POOL_IMPL_ID));
  const poolConfiguratorImpl = await getPoolConfiguratorImpl(
    await getAddressFromJson(network, POOL_CONFIGURATOR_IMPL_ID)
  );
  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
  );
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
});
