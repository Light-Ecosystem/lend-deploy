import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import {
  ConfigNames,
  eNetwork,
  fillNonceTransaction,
  isL2PoolSupported,
  loadPoolConfig,
  waitForTx,
} from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  if (isL2PoolSupported(poolConfig)) {
    if (process.env.RELEASE == 'true') {
      await fillNonceTransaction(6);
    }
    // Deploy L2 libraries
    await deploy('CalldataLogic', {
      from: deployer,
      args: [],
      ...COMMON_DEPLOY_PARAMS,
    });
  }

  return true;
};

func.id = 'CalldataLibraries';
func.tags = ['core', 'logic'];

export default func;
