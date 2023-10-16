import { deployContract } from '../../helpers/utilities/tx';
import { task } from 'hardhat/config';
import {
  MULTISIG_ADDRESS,
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from '../../helpers/constants';
import { FORK } from '../../helpers';
import { ethers } from 'ethers';

task(`test-encode`, `Test Encode`).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }
  let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 600000]);
  console.log('adapterParams:', adapterParams);
});
