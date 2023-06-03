import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { time } from '@nomicfoundation/hardhat-network-helpers';
import {
  POOL_PROXY_ID,
  TESTNET_TOKEN_PREFIX,
  LENDING_GAUGE_IMPL_ID,
  VOTING_ESCROW_ID,
  MINTER_ID,
  GAUGE_CONTROLLER_ID,
  GAUGE_FACTORY_ID,
} from '../../helpers/deploy-ids';
import { GaugeFactory, Pool, Pool__factory } from '../../typechain';
import { BigNumberish } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { checkDaiGaugeExists, eEthereumNetwork, eNetwork, waitForTx } from '../../helpers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (process.env.FORK || hre.network.name) as eNetwork;
  const SYMBOL = 'DAI';
  // 1. Deploy LendingGauge Impl as template
  const LendingGaugeImpl = await deploy(LENDING_GAUGE_IMPL_ID, {
    contract: 'LendingGauge',
    from: deployer,
    args: [],
    log: true,
  });
  // 2. Deploy GaugeFactory for create LendingGauge
  const GaugeFactory = await deploy(GAUGE_FACTORY_ID, {
    from: deployer,
    args: [
      (await deployments.get(POOL_PROXY_ID)).address,
      LendingGaugeImpl.address,
      (await deployments.get(MINTER_ID)).address,
      (await deployments.get(VOTING_ESCROW_ID)).address,
    ],
  });
  const gaugeFactoryInstance = (await ethers.getContractAt(
    GaugeFactory.abi,
    GaugeFactory.address
  )) as GaugeFactory;
  // 3. Setup deployer as operator for create LendingGauge
  await waitForTx(await gaugeFactoryInstance.addOperator(deployer));
  // 4. Create DAI LendingGauge
  await waitForTx(
    await gaugeFactoryInstance.createLendingGauge(
      (
        await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
      ).address
    )
  );
  // 5. Get DAI LendingGauge address
  const daiLendingGaugeAddress = await gaugeFactoryInstance.lendingGauge(
    (
      await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
    ).address
  );
  // 6. Get Pool contract instance
  const poolInstance = (await hre.ethers.getContractAt(
    'Pool',
    (
      await deployments.get(POOL_PROXY_ID)
    ).address
  )) as Pool;
  // 7. Get DAI LendingGauge contract instance
  const lendingGaugeInstance = await hre.ethers.getContractAt(
    LendingGaugeImpl.abi,
    daiLendingGaugeAddress
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
  // 9. For DAI LendingGauge add phases
  await waitForTx(await lendingGaugeInstance.addPhases(inputParams));
  // 10. For hDai、variableDebtDAI set LendingGauge by Pool Contract
  await poolInstance.setLendingGauge(
    (
      await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
    ).address,
    daiLendingGaugeAddress
  );
  // 11. Get GaugeController contract instance
  const { abi, address } = await deployments.get(GAUGE_CONTROLLER_ID);
  const gaugeControllerInstance = await hre.ethers.getContractAt(abi, address);
  // 12. Add gauge type by GaugeController (LendingGaugeType is 2)
  const name = 'Lending Type';
  const weight = hre.ethers.utils.parseEther('1');
  const typeId = await gaugeControllerInstance.nGaugeTypes();
  // TODO(Dev & Beta TypeID not equal)
  if (typeId == 2 || typeId == 3) {
    await waitForTx(await gaugeControllerInstance.addType(name, weight));
    if (network == eEthereumNetwork.hardhat) {
      const gaugeWeight = hre.ethers.utils.parseEther('1');
      await gaugeControllerInstance.addGauge(daiLendingGaugeAddress, typeId, gaugeWeight);
      await time.increase(86400 * 7);
    } else {
      // 13. Add DAI LenidngGauge to GaugeController
      await waitForTx(await gaugeControllerInstance.addGauge(daiLendingGaugeAddress, typeId, 0));
    }
  }
};

export default func;
func.skip = async () => checkDaiGaugeExists('DAI');
func.tags = ['lending-gauge'];
