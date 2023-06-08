import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../helpers/env';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('PoolAddressesProviderRegistry', {
    from: deployer,
    args: [deployer],
    ...COMMON_DEPLOY_PARAMS,
  });
  return true;
};

func.id = 'PoolAddressesProviderRegistry';
func.tags = ['core', 'registry'];

export default func;
