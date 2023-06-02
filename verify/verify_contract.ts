import { run } from 'hardhat';
import FlashLoanLogicArtifact from '../deployments/sepolia/FlashLoanLogic.json';
import PoolImplArtifact from '../deployments/sepolia/Pool-Implementation.json';
import PoolAddressProviderArtifact from '../deployments/sepolia/PoolAddressesProvider-HopeLend.json';
import PoolConfiguratorImplArtifact from '../deployments/sepolia/PoolConfigurator-Implementation.json';

async function main() {
  await verifyContract(FlashLoanLogicArtifact.address, []);
  await verifyContract(PoolImplArtifact.address, [PoolAddressProviderArtifact.address]);
  await verifyContract(PoolConfiguratorImplArtifact.address, []);
}

async function verifyContract(address: string, args: any) {
  try {
    console.log('Verifying contract...   ', address);
    await run('verify:verify', {
      address: address,
      constructorArguments: args,
    });
  } catch (err: any) {
    if (err.toString().includes('Contract source code already verified')) {
      console.log(' Contract source code already verified');
    } else {
      console.log(err);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
