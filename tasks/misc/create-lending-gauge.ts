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
import { POOL_DATA_PROVIDER, POOL_PROXY_ID, eNetwork } from '../../helpers';

task(`create-lending-gauge`, `Create lending gauge`)
  .addParam('symbol', 'The ERC20 address')
  .setAction(async ({ symbol }, hre) => {
    const network = hre.network.name as eNetwork;
    const gaugeFactoryInstance = await getGaugeFactory();
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
    // Create ${SYMBOL} LendingGauge
    await waitForTx(await gaugeFactoryInstance.createLendingGauge(address));
    // Get ${SYMBOL} LendingGauge address
    const lendingGaugeAddress = await gaugeFactoryInstance.lendingGauge(address);
    console.log(`[Created] LendingGauge is: ${lendingGaugeAddress}`);

    // Get ${SYMBOL} LendingGauge contract instance
    const lendingGaugeInstance = await hre.ethers.getContractAt(
      LendingGaugeImplABI,
      lendingGaugeAddress
    );
    // Init phases data (offchain calculate)
    const inputParams: {
      start: BigNumberish;
      end: BigNumberish;
      k: BigNumberish;
      b: BigNumberish;
    }[] = [
      {
        start: parseUnits('0', 0),
        end: parseUnits('0.35', 27),
        k: parseUnits('2', 27),
        b: parseUnits('0', 0),
      },
      {
        start: parseUnits('0.35', 27),
        end: parseUnits('0.65', 27),
        k: parseUnits('0', 0),
        b: parseUnits('0.7', 27),
      },
      {
        start: parseUnits('0.65', 27),
        end: parseUnits('0.8', 27),
        k: parseUnits('-4.66666666666666', 27),
        b: parseUnits('3.733333333333333', 27),
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
    await poolInstance.setLendingGauge(address, lendingGaugeAddress);
    console.log('[Setup] LendingGauge configuration completed!');
  });
