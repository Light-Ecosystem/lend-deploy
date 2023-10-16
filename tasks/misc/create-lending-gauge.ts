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

task(`create-lending-gauge`, `Create lending gauge`)
  .addParam('symbol', 'The ERC20 address')
  .setAction(async ({ symbol }, hre) => {
    const network = hre.network.name as eNetwork;
    const poolInstance = await getPool();
    const dataProvider = await getHopeLendProtocolDataProvider();
    const gaugeFactory = await getGaugeFactory();
    const reserves = await dataProvider.getAllReservesTokens();
    let tokenAddress;
    for (let x = 0; x < reserves.length; x++) {
      const { symbol: tokenSymbol, tokenAddress: address } = reserves[x];
      if (symbol == tokenSymbol) {
        tokenAddress = address;
        console.log(`- Symbol: ${symbol} Address: ${tokenAddress}`);
      }
    }

    if (!tokenAddress) {
      console.log('[ERROR] ERC20 address is unkown!');
      return;
    }

    // Create ${SYMBOL} LendingGauge
    await waitForTx(await gaugeFactory.createLendingGauge(tokenAddress));
    // Get ${SYMBOL} LendingGauge
    const gaugeAddress = await gaugeFactory.lendingGauge(tokenAddress);
    if (!gaugeAddress || gaugeAddress == ZERO_ADDRESS) {
      console.log('[ERROR] gauge not created!');
      return;
    }
    console.log(`- Gauge Address: ${gaugeAddress}`);

    // Get ${SYMBOL} LendingGauge contract instance
    const lendingGaugeInstance = await hre.ethers.getContractAt(LendingGaugeImplABI, gaugeAddress);
    // Init phases data (offchain calculate)
    const inputParams: {
      start: BigNumberish;
      end: BigNumberish;
      k: BigNumberish;
      b: BigNumberish;
    }[] = [
      {
        start: parseUnits('0', 0),
        end: parseUnits('0.05', 27),
        k: parseUnits('12', 27),
        b: parseUnits('0', 0),
      },
      {
        start: parseUnits('0.05', 27),
        end: parseUnits('0.45', 27),
        k: parseUnits('0', 0),
        b: parseUnits('0.6', 27),
      },
      {
        start: parseUnits('0.45', 27),
        end: parseUnits('0.5', 27),
        k: parseUnits('-12', 27),
        b: parseUnits('6', 27),
      },
      {
        start: parseUnits('0.5', 27),
        end: parseUnits('1', 27),
        k: parseUnits('0', 0),
        b: parseUnits('0', 0),
      },
    ];
    // For ${SYMBOL} LendingGauge add phases
    await waitForTx(await lendingGaugeInstance.addPhases(inputParams));
    console.log('[Setup] LendingGauge add phases completed!');
    // For h${SYMBOL}、variableDebt${SYMBOL} set LendingGauge by Pool Contract
    await poolInstance.setLendingGauge(tokenAddress, gaugeAddress);
    console.log('[Setup] LendingGauge configuration completed!');
  });
