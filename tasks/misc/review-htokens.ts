import { getHToken, getPoolAddressesProvider } from '../../helpers/contract-getters';
import { POOL_ADDRESSES_PROVIDER_ID } from '../../helpers/deploy-ids';
import { getAddressFromJson } from '../../helpers/utilities/tx';
import { getHopeLendProtocolDataProvider } from '../../helpers/contract-getters';
import { task } from 'hardhat/config';
import { FORK } from '../../helpers/hardhat-config-helpers';

interface HTokenConfig {
  revision: string;
  name: string;
  symbol: string;
  decimals: string;
  treasury: string;
  pool: string;
  underlying: string;
}

task(`review-htokens`)
  .addFlag('log')
  .setAction(async ({ log }, { deployments, getNamedAccounts, ...hre }) => {
    console.log('start review');
    const network = FORK ? FORK : hre.network.name;

    const poolAddressesProvider = await getPoolAddressesProvider(
      await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
    );

    const protocolDataProvider = await getHopeLendProtocolDataProvider(
      await poolAddressesProvider.getPoolDataProvider()
    );

    const reserves = await protocolDataProvider.getAllHTokens();

    const HTokenConfigs: { [key: string]: HTokenConfig } = {};
    for (let x = 0; x < reserves.length; x++) {
      const [symbol, asset] = reserves[x];

      const hToken = await getHToken(asset);

      HTokenConfigs[symbol] = {
        name: await hToken.name(),
        symbol: await hToken.symbol(),
        decimals: (await hToken.decimals()).toString(),
        revision: (await hToken.HTOKEN_REVISION()).toString(),
        treasury: await hToken.RESERVE_TREASURY_ADDRESS(),
        underlying: await hToken.UNDERLYING_ASSET_ADDRESS(),
        pool: await hToken.POOL(),
      };
    }
    if (log) {
      console.log('HTokens Config:');
      console.table(HTokenConfigs);
    }
    return HTokenConfigs;
  });
