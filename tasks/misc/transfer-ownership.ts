import { FORK } from './../../helpers/hardhat-config-helpers';
import { waitForTx } from './../../helpers/utilities/tx';
import { getOwnableContract } from './../../helpers/contract-getters';
import { task } from 'hardhat/config';
import { isAddress } from 'ethers/lib/utils';

task(`transfer-ownership`)
  .addParam('address')
  .addOptionalParam('admin')
  .setAction(async ({ address, admin }, hre) => {
    if (!isAddress(admin)) {
      return;
    }
    let owner = admin;

    const contract = await getOwnableContract(address);
    const currentOwner = await contract.owner();
    if (currentOwner == owner) {
      console.log(`- Owner of ${address} is already ${owner}`);
    } else {
      await waitForTx(await contract.transferOwnership(owner));
      const newOwner = await contract.pendingOwner();
      console.log(`- Changed owner from ${currentOwner} to ${newOwner}`);
      console.log('- Pending new owner accept ownership................');
    }
  });
