import { task } from 'hardhat/config';
import {
  eNetwork,
  getHopeLendProtocolDataProvider,
  getAddressFromJson,
  POOL_DATA_PROVIDER,
  getPool,
  POOL_PROXY_ID,
} from '../../helpers';

task(`verify-tokens`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
  const network = hre.network.name as eNetwork;
  const dataProvider = await getHopeLendProtocolDataProvider(
    await getAddressFromJson(network, POOL_DATA_PROVIDER)
  );
  const pool = await getPool(await getAddressFromJson(network, POOL_PROXY_ID));
  const reserves = await dataProvider.getAllReservesTokens();

  for (let x = 0; x < reserves.length; x++) {
    const { symbol, tokenAddress } = reserves[x];
    console.log(`- Verifying ${symbol} proxies:`);
    const { hTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress } =
      await dataProvider.getReserveTokensAddresses(tokenAddress);
    try {
      await hre.run('verify:verify', {
        address: hTokenAddress,
        constructorArguments: [pool.address],
      });
    } catch (error) {
      console.error(error);
    }
    try {
      await hre.run('verify:verify', {
        address: stableDebtTokenAddress,
        constructorArguments: [pool.address],
      });
    } catch (error) {
      console.error(error);
    }
    try {
      await hre.run('verify:verify', {
        address: variableDebtTokenAddress,
        constructorArguments: [pool.address],
      });
    } catch (error) {
      console.error(error);
    }
  }
});
