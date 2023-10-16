import { getReserveAddress } from '../../helpers/market-config-helpers';
import { task } from 'hardhat/config';
import { getAddressFromJson, waitForTx } from '../../helpers/utilities/tx';
import { ConfigNames, loadPoolConfig } from '../../helpers/market-config-helpers';
import {
  getGaugeFactory,
  getHopeLendProtocolDataProvider,
  getPool,
  getPoolConfiguratorProxy,
} from '../../helpers/contract-getters';
import { BigNumber, BigNumberish } from 'ethers';
import { MARKET_NAME } from '../../helpers/env';
import { parseUnits } from 'ethers/lib/utils';
import LendingGaugeImplABI from '../../abi/LendingGauge.json';
import { POOL_DATA_PROVIDER, POOL_PROXY_ID, ZERO_ADDRESS, eNetwork } from '../../helpers';

task(`setup-lending-gauge`, `Create lending gauge`)
  .addParam('symbol', 'The ERC20 symbol')
  .addParam('gauge', 'The LendingGauge address')
  .setAction(async ({ symbol, gauge }, hre) => {
    const network = hre.network.name as eNetwork;
    const poolInstance = await getPool();
    const dataProvider = await getHopeLendProtocolDataProvider();
    const reserves = await dataProvider.getAllReservesTokens();
    let address;
    for (let x = 0; x < reserves.length; x++) {
      const { symbol: tokenSymbol, tokenAddress } = reserves[x];
      if (symbol == tokenSymbol) {
        address = tokenAddress;
        console.log(`- Symbol: ${symbol} Address: ${tokenAddress}`);
      }
    }
    if (!address) {
      console.log('[ERROR] address is unkown!');
      return;
    }

    console.log(`[INFO] LendingGauge is: ${gauge}`);

    // Get ${SYMBOL} LendingGauge contract instance
    const lendingGaugeInstance = await hre.ethers.getContractAt(LendingGaugeImplABI, gauge);
    // Init phases data (offchain calculate)
    const inputParams: {
      start: BigNumberish;
      end: BigNumberish;
      k: BigNumberish;
      b: BigNumberish;
    }[] = [
      {
        start: parseUnits('0', 0),
        end: parseUnits('0.3', 27),
        k: '1833333333333333333333333333',
        b: parseUnits('0', 0),
      },
      {
        start: parseUnits('0.3', 27),
        end: parseUnits('0.6', 27),
        k: parseUnits('0', 0),
        b: parseUnits('0.55', 27),
      },
      {
        start: parseUnits('0.6', 27),
        end: parseUnits('0.8', 27),
        k: parseUnits('-2.75', 27),
        b: parseUnits('2.2', 27),
      },
      {
        start: parseUnits('0.8', 27),
        end: parseUnits('1', 27),
        k: parseUnits('0', 0),
        b: parseUnits('0', 0),
      },
    ];
    // For ${SYMBOL} LendingGauge add phases
    await waitForTx(await lendingGaugeInstance.addPhases(inputParams));
    // For h${SYMBOL}、variableDebt${SYMBOL} set LendingGauge by Pool Contract
    await waitForTx(await poolInstance.setLendingGauge(address, gauge));
    console.log('[Setup] LendingGauge configuration completed!');
  });
