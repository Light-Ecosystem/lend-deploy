import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';
import { chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy } from '../../helpers/constants';
import { eNetwork } from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  if (!chainlinkAggregatorProxy[network]) {
    console.log(
      '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
    );
    return;
  }

  // Deploy UiPoolDataProvider getter helper
  await deploy('UiPoolDataProvider', {
    from: deployer,
    args: [chainlinkAggregatorProxy[network], chainlinkEthUsdAggregatorProxy[network]],
    ...COMMON_DEPLOY_PARAMS,
  });
};

func.tags = ['periphery-post', 'ui-helpers'];

export default func;
