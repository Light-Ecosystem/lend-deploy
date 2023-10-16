import { deployContract } from '../../helpers/utilities/tx';
import { task } from 'hardhat/config';
import {
  MULTISIG_ADDRESS,
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from '../../helpers/constants';
import { FORK } from '../../helpers';

task(`deploy-mock-sequencer-oracle`, `Deploys the Mock sequencer oracle contract`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }
    const networkId = FORK ? FORK : hre.network.name;

    // owner
    const desiredMultisig = MULTISIG_ADDRESS[networkId];

    console.log(`\n- SequencerOracle deployment`);
    const artifact = await deployContract('SequencerOracle', [desiredMultisig]);

    console.log('SequencerOracle:', artifact.address);
    console.log('Network:', hre.network.name);
  }
);
