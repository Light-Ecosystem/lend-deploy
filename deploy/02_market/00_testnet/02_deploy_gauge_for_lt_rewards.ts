import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { 
    STAKING_HOPE_ID,
    GAUGE_CONTROLLER_ID,
} from '../../../helpers/deploy-ids';
import { waitForTx } from '../../../helpers/utilities/tx';
import GaugeControllerArtifact from '../../../extendedArtifacts/GaugeController.json';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  if (hre.network.name != "hardhat") {
    console.log('[NOTICE] Skipping deployment of withdrwa-lt-reward');
    return;
  }

  const stHopeAddress = (await deployments.get(STAKING_HOPE_ID)).address;
  const gaugeControllerAddress = (await deployments.get(GAUGE_CONTROLLER_ID)).address;

  const gaugeControllerInstance = (await hre.ethers.getContractAt(
    GaugeControllerArtifact.abi,
    gaugeControllerAddress
  )) as any;

  // add gauge to gaugeController
  const name = "stHopeGauge";
  const typeId = await gaugeControllerInstance.nGaugeTypes();
  const weight = hre.ethers.utils.parseEther("1");
  await waitForTx(
    await gaugeControllerInstance.addType(name, weight)
  );
  await waitForTx(
    await gaugeControllerInstance.addGauge(stHopeAddress, typeId, weight)
  );
};

func.tags = ['deploy-gauge-lt-rewards'];

export default func;
