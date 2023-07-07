import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import RestrictedListArtifact from '../../extendedArtifacts/RestrictedList.json';
import LTArtifact from '../../extendedArtifacts/LT.json';
import HOPEArtifact from '../../extendedArtifacts/HOPE.json';
import StakingHOPEArtifact from '../../extendedArtifacts/StakingHOPE.json';
import VotingEscrowArtifact from '../../extendedArtifacts/VotingEscrow.json';
import Permit2Artifact from '../../extendedArtifacts/Permit2.json';
import GaugeControllerArtifact from '../../extendedArtifacts/GaugeController.json';
import MinterArtifact from '../../extendedArtifacts/Minter.json';
import BurnerManagerArtifact from '../../extendedArtifacts/BurnerManager.json';
import UnderlyingBurnerArtifact from '../../extendedArtifacts/UnderlyingBurner.json';
import FeeToVaultArtifact from '../../extendedArtifacts/FeeToVault.json';
import ProxyAdminArtifact from '../../extendedArtifacts/ProxyAdmin.json';
import MockGaugeArtifact from '../../extendedArtifacts/MockGauge.json';
import { time } from '@nomicfoundation/hardhat-network-helpers';
import {
  BURNER_MANAGER_ID,
  ConfigNames,
  FEE_TO_VAULT_ID,
  GAUGE_CONTROLLER_ID,
  HOPE_ID,
  LT_ID,
  MINTER_ID,
  PERMIT2_ID,
  PROXY_ADMIN_ID,
  STAKING_HOPE_ID,
  UNDERLYING_BURNER_ID,
  VOTING_ESCROW_ID,
  ZERO_ADDRESS,
  eEthereumNetwork,
  eNetwork,
  getParamPerNetwork,
  isUnitTestEnv,
  loadPoolConfig,
} from '../../helpers';
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from '../../helpers/env';
import { getAddress } from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, save } = deployments;
  const { deployer } = await getNamedAccounts();

  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const {
    LTAddress,
    HOPEAddress,
    StakingHOPEAddress,
    VotingEscrowAddress,
    GaugeControllerAddress,
    MinterAddress,
    Permit2Address,
    BurnerManagerAddress,
    UnderlyingBurnerAddress,
    FeeToVaultAddress,
    ProxyAdminAddress,
  } = poolConfig;
  const network = (process.env.FORK || hre.network.name) as eNetwork;
  const ltAddress = getParamPerNetwork(LTAddress, network);
  if (ltAddress && getAddress(ltAddress) !== ZERO_ADDRESS) {
    save(LT_ID, {
      address: ltAddress,
      abi: LTArtifact.abi,
    });
    save(HOPE_ID, {
      address: getParamPerNetwork(HOPEAddress, network) as string,
      abi: HOPEArtifact.abi,
    });
    save(STAKING_HOPE_ID, {
      address: getParamPerNetwork(StakingHOPEAddress, network) as string,
      abi: StakingHOPEArtifact.abi,
    });
    save(VOTING_ESCROW_ID, {
      address: getParamPerNetwork(VotingEscrowAddress, network) as string,
      abi: VotingEscrowArtifact.abi,
    });
    save(GAUGE_CONTROLLER_ID, {
      address: getParamPerNetwork(GaugeControllerAddress, network) as string,
      abi: GaugeControllerArtifact.abi,
    });
    save(MINTER_ID, {
      address: getParamPerNetwork(MinterAddress, network) as string,
      abi: MinterArtifact.abi,
    });
    save(PERMIT2_ID, {
      address: getParamPerNetwork(Permit2Address, network) as string,
      abi: Permit2Artifact.abi,
    });
    save(BURNER_MANAGER_ID, {
      address: getParamPerNetwork(BurnerManagerAddress, network) as string,
      abi: BurnerManagerArtifact.abi,
    });
    save(UNDERLYING_BURNER_ID, {
      address: getParamPerNetwork(UnderlyingBurnerAddress, network) as string,
      abi: UnderlyingBurnerArtifact.abi,
    });
    save(FEE_TO_VAULT_ID, {
      address: getParamPerNetwork(FeeToVaultAddress, network) as string,
      abi: FeeToVaultArtifact.abi,
    });
    save(PROXY_ADMIN_ID, {
      address: getParamPerNetwork(ProxyAdminAddress, network) as string,
      abi: ProxyAdminArtifact.abi,
    });
    return;
  }

  const LT = await deploy(LT_ID, {
    contract: {
      abi: LTArtifact.abi,
      bytecode: LTArtifact.bytecode,
    },
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: ['LT Token', 'LT'],
        },
      },
    },
    skipIfAlreadyDeployed: true,
    ...COMMON_DEPLOY_PARAMS,
  });

  const RestrictedList = await deploy('RestrictedList', {
    contract: {
      abi: RestrictedListArtifact.abi,
      bytecode: RestrictedListArtifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const Permit2 = await deploy(PERMIT2_ID, {
    contract: {
      abi: Permit2Artifact.abi,
      bytecode: Permit2Artifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const VotingEscrow = await deploy(VOTING_ESCROW_ID, {
    contract: {
      abi: VotingEscrowArtifact.abi,
      bytecode: VotingEscrowArtifact.bytecode,
    },
    from: deployer,
    args: [LT.address, Permit2.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  const ltInstance = await hre.ethers.getContractAt(LT.abi, LT.address);
  await time.increase(2 * 86400);
  await ltInstance.updateMiningParameters();
  await ltInstance.approve(Permit2.address, hre.ethers.constants.MaxUint256);

  const GaugeController = await deploy(GAUGE_CONTROLLER_ID, {
    contract: {
      abi: GaugeControllerArtifact.abi,
      bytecode: GaugeControllerArtifact.bytecode,
    },
    from: deployer,
    args: [LT.address, VotingEscrow.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  const Minter = await deploy(MINTER_ID, {
    contract: {
      abi: MinterArtifact.abi,
      bytecode: MinterArtifact.bytecode,
    },
    from: deployer,
    args: [LT.address, GaugeController.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  if (isUnitTestEnv()) {
    // Only unit test need mintable erc20 HOPE
    await deploy(HOPE_ID, {
      from: deployer,
      contract: 'MintableERC20',
      args: ['HOPE', 'HOPE', 18, deployer],
      ...COMMON_DEPLOY_PARAMS,
    });
  } else {
    await deploy(HOPE_ID, {
      contract: {
        abi: HOPEArtifact.abi,
        bytecode: HOPEArtifact.bytecode,
      },
      from: deployer,
      proxy: {
        owner: deployer,
        proxyContract: 'OpenZeppelinTransparentProxy',
        execute: {
          init: {
            methodName: 'initialize',
            args: [RestrictedList.address],
          },
        },
      },
      skipIfAlreadyDeployed: true,
      ...COMMON_DEPLOY_PARAMS,
    });
  }

  const BurnerManager = await deploy(BURNER_MANAGER_ID, {
    contract: {
      abi: BurnerManagerArtifact.abi,
      bytecode: BurnerManagerArtifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const UnderlyingBurner = await deploy(UNDERLYING_BURNER_ID, {
    contract: {
      abi: UnderlyingBurnerArtifact.abi,
      bytecode: UnderlyingBurnerArtifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const FeeToVault = await deploy(FEE_TO_VAULT_ID, {
    contract: {
      abi: FeeToVaultArtifact.abi,
      bytecode: FeeToVaultArtifact.bytecode,
    },
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [
            BurnerManager.address,
            UnderlyingBurner.address,
            (await deployments.get(HOPE_ID)).address,
          ],
        },
      },
    },
    skipIfAlreadyDeployed: true,
    ...COMMON_DEPLOY_PARAMS,
  });

  const ProxyAdmin = await deploy('ProxyAdmin', {
    contract: {
      abi: ProxyAdminArtifact.abi,
      bytecode: ProxyAdminArtifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const StakingHope = await deploy(STAKING_HOPE_ID, {
    contract: {
      abi: StakingHOPEArtifact.abi,
      bytecode: StakingHOPEArtifact.bytecode,
    },
    from: deployer,
    args: [(await deployments.get(HOPE_ID)).address, Minter.address, Permit2.address],
    ...COMMON_DEPLOY_PARAMS,
  });

  await ltInstance.setMinter(Minter.address);

  const MockSwapGauge = await deploy('MockSwapGauge', {
    contract: {
      abi: MockGaugeArtifact.abi,
      bytecode: MockGaugeArtifact.bytecode,
    },
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  const gaugeControllerInstance = await hre.ethers.getContractAt(
    GaugeController.abi,
    GaugeController.address
  );
  const stakingTypeName = 'HOPE Staking Type';
  const stakingTypeWeight = hre.ethers.utils.parseEther('1');
  const stakingTypeId = await gaugeControllerInstance.nGaugeTypes();
  await gaugeControllerInstance.addType(stakingTypeName, stakingTypeWeight);
  const swapTypeName = 'HOPE Swap Type';
  const swapTypeWeight = hre.ethers.utils.parseEther('1');
  const swapTypeId = await gaugeControllerInstance.nGaugeTypes();
  await gaugeControllerInstance.addType(swapTypeName, swapTypeWeight);

  const gaugeWeightStaking = hre.ethers.utils.parseEther('1');
  const gaugeWeightSwap = hre.ethers.utils.parseEther('2');
  await gaugeControllerInstance.addGauge(
    (
      await deployments.get(STAKING_HOPE_ID)
    ).address,
    stakingTypeId,
    gaugeWeightStaking
  );
  await gaugeControllerInstance.addGauge(MockSwapGauge.address, swapTypeId, gaugeWeightSwap);
};

export default func;
func.tags = ['light-dao', 'init-testnet'];
