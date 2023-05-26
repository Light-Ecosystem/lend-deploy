import { run } from "hardhat";
import FlashLogicArtifact from "../deployments/sepolia/FlashLoanLogic.json";

async function main() {
  await verifyContract(FlashLogicArtifact.address, []);
}

async function verifyContract(address: string, args: any) {
  try {
    console.log("Verifying contract...   ", address);
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (err: any) {
    if (err.toString().includes("Contract source code already verified")) {
      console.log(" Contract source code already verified");
    } else {
      console.log(err);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
