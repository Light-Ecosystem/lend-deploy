import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
  POOL_PROXY_ID,
  TESTNET_TOKEN_PREFIX,
  LENDING_GAUGE_IMPL_ID,
  VOTING_ESCROW_ID,
  MINTER_ID,
  GAUGE_CONTROLLER_ID,
  GAUGE_FACTORY_ID,
  LENDING_GAUGE_PREFIX,
} from '../../helpers/deploy-ids';
import { GaugeFactory, Pool } from '../../typechain';
import { BigNumberish } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
  ConfigNames,
  advanceTimeAndBlock,
  eNetwork,
  fillNonceTransaction,
  getMinterAddress,
  getVotingEscrowAddress,
  isL2PoolSupported,
  isProductionMarket,
  isUnitTestEnv,
  loadPoolConfig,
  waitForTx,
} from '../../helpers';
import { MARKET_NAME } from '../../helpers/env';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, save } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  if (isL2PoolSupported(poolConfig)) {
    console.log(`[INFO] Skipped LendingGauge due current network '${network}' is not supported`);
    if (process.env.RELEASE == 'true') {
      await fillNonceTransaction(3);
    }
    return;
  }

  // 1. Deploy LendingGauge Impl as template
  const LendingGaugeImpl = await deploy(LENDING_GAUGE_IMPL_ID, {
    contract: 'LendingGauge',
    from: deployer,
    args: [],
    log: true,
  });
  const { address: poolAddress } = await deployments.get(POOL_PROXY_ID);
  const minterAddress = await getMinterAddress(poolConfig, network);
  const votingEscrowAddress = await getVotingEscrowAddress(poolConfig, network);
  // 2. Deploy GaugeFactory for create LendingGauge
  const GaugeFactory = await deploy(GAUGE_FACTORY_ID, {
    from: deployer,
    args: [poolAddress, LendingGaugeImpl.address, minterAddress, votingEscrowAddress],
  });
  const gaugeFactoryInstance = (await hre.ethers.getContractAt(
    GaugeFactory.abi,
    GaugeFactory.address
  )) as GaugeFactory;
  // 3. Setup deployer address for create LendingGauge
  await waitForTx(await gaugeFactoryInstance.addOperator(deployer));

  if (isProductionMarket(poolConfig)) {
    console.log('[Deployment] Skipping lending gauge setup at production market');
    // Early exit if is not a testnet market
    return true;
  }
  if (!isUnitTestEnv()) {
    console.log('[Deployment] Skipping lending gauge setup at testnet market');
    // Early exit if is not a test market
    return true;
  }
  console.log(
    `- Setting up testnet lending gauge for "${MARKET_NAME}" market at "${network}" network`
  );

  const { abi, address } = await deployments.get(GAUGE_CONTROLLER_ID);
  const gaugeControllerInstance = await hre.ethers.getContractAt(abi, address);
  const name = 'Hope Lend';
  const weight = hre.ethers.utils.parseEther('1');
  const typeId = await gaugeControllerInstance.nGaugeTypes();

  // Add gauge type by GaugeController (LendingGaugeType is 2)
  if (typeId == 2) {
    await waitForTx(await gaugeControllerInstance.addType(name, weight));
  }

  const SYMBOLS = ['DAI'];

  for (const SYMBOL of SYMBOLS) {
    // 4. Create ${SYMBOL} LendingGauge
    await waitForTx(
      await gaugeFactoryInstance.createLendingGauge(
        (
          await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
        ).address
      )
    );
    // 5. Get ${SYMBOL} LendingGauge address
    const lendingGaugeAddress = await gaugeFactoryInstance.lendingGauge(
      (
        await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
      ).address
    );
    // Save LendingGauge to deployments
    save(`${SYMBOL}${LENDING_GAUGE_PREFIX}`, {
      address: lendingGaugeAddress,
      abi: LendingGaugeImpl.abi,
    });
    // 6. Get Pool contract instance
    const poolInstance = (await hre.ethers.getContractAt(
      'Pool',
      (
        await deployments.get(POOL_PROXY_ID)
      ).address
    )) as Pool;
    // 7. Get ${SYMBOL} LendingGauge contract instance
    const lendingGaugeInstance = await hre.ethers.getContractAt(
      LendingGaugeImpl.abi,
      lendingGaugeAddress
    );
    // 8. Init phases data (offchain calculate)
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
    // 9. For ${SYMBOL} LendingGauge add phases
    await waitForTx(await lendingGaugeInstance.addPhases(inputParams));
    // 10. For h${SYMBOL}、variableDebt${SYMBOL} set LendingGauge by Pool Contract
    await poolInstance.setLendingGauge(
      (
        await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
      ).address,
      lendingGaugeAddress
    );
    // 11. GaugeController add gauge
    const gaugeWeight = hre.ethers.utils.parseEther('1');
    await gaugeControllerInstance.addGauge(lendingGaugeAddress, typeId, gaugeWeight);
    await advanceTimeAndBlock(86400 * 7);
  }
  return true;
};

export default func;
func.tags = ['lending-gauge'];
func.id = 'LendingGauge';
