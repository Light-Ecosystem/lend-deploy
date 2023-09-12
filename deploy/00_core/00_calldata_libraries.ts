import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import { ConfigNames, eNetwork, isL2PoolSupported, loadPoolConfig, waitForTx } from '../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  const deployerSigner = await hre.ethers.getSigner(deployer);
  if (isL2PoolSupported(poolConfig)) {
    // Deploy L2 libraries
    await deploy('CalldataLogic', {
      from: deployer,
      args: [],
      ...COMMON_DEPLOY_PARAMS,
    });
  } else {
    for (let i = 0; i < 1; i++) {
      // 获取当前 nonce
      const nonce = await deployerSigner.getTransactionCount();

      // 创建一个空交易
      const emptyTransaction = {
        nonce: nonce, // 指定要占用的 nonce
        gasLimit: 21000, // 根据网络设置合适的 gasLimit
        to: deployerSigner.address, // 可以发送到自己的地址
        value: 0, // 没有转账价值
      };

      // 发送空交易
      await waitForTx(await deployerSigner.sendTransaction(emptyTransaction));
    }
  }

  // if (!isL2PoolSupported(poolConfig)) {
  //   console.log(`[INFO] Skipped L2 Pool due current network '${network}' is not supported`);
  //   return true;
  // }

  // Deploy L2 libraries
  // await deploy('CalldataLogic', {
  //   from: deployer,
  //   args: [],
  //   ...COMMON_DEPLOY_PARAMS,
  // });

  return true;
};

func.id = 'CalldataLibraries';
func.tags = ['core', 'logic'];

export default func;
