import { deployments } from "hardhat";
import { initializeMakeSuite } from "./utils/make-suite";

before(async () => {
  // Deploy HopeLend Market as fixture
  await deployments.fixture(["periphery-pre", "market", "periphery-post"]);

  await initializeMakeSuite();
  console.log("\n***************");
  console.log("Setup finished");
  console.log("***************\n");
});
