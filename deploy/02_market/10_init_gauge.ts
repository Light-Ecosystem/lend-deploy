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
import { eEthereumNetwork, eNetwork } from '../../helpers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (process.env.FORK || hre.network.name) as eNetwork;

  const SYMBOL = 'DAI';

  const LendingGaugeImpl = await deploy(LENDING_GAUGE_IMPL_ID, {
    contract: 'LendingGauge',
    from: deployer,
    args: [],
    log: true,
  });

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
  await gaugeFactoryInstance.addOperator(deployer);
  await gaugeFactoryInstance.createLendingGauge(
    (
      await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
    ).address
  );
  const daiLendingGaugeAddress = await gaugeFactoryInstance.lendingGauge(
    (
      await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
    ).address
  );

  const poolInstance = (await hre.ethers.getContractAt(
    'Pool',
    (
      await deployments.get(POOL_PROXY_ID)
    ).address
  )) as Pool;

  const lendingGaugeInstance = await hre.ethers.getContractAt(
    LendingGaugeImpl.abi,
    daiLendingGaugeAddress
  );

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

  await lendingGaugeInstance.addPhases(inputParams);

  await poolInstance.setLendingGauge(
    (
      await deployments.get(`${SYMBOL}${TESTNET_TOKEN_PREFIX}`)
    ).address,
    daiLendingGaugeAddress
  );

  const { abi, address } = await deployments.get(GAUGE_CONTROLLER_ID);

  const gaugeControllerInstance = await hre.ethers.getContractAt(abi, address);

  const name = 'Lending Type';
  const weight = hre.ethers.utils.parseEther('1');
  const typeId = await gaugeControllerInstance.nGaugeTypes();
  if (typeId == 2) {
    await gaugeControllerInstance.addType(name, weight);
    if (network == eEthereumNetwork.hardhat) {
      const gaugeWeight = hre.ethers.utils.parseEther('1');
      await gaugeControllerInstance.addGauge(daiLendingGaugeAddress, typeId, gaugeWeight);
      await time.increase(86400 * 7);
    } else {
      await gaugeControllerInstance.addGauge(deployer, typeId, 0);
    }
  }
};

export default func;
func.tags = ['lending-gauge'];
