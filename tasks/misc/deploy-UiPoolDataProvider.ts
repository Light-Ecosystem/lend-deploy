import { deployContract } from "./../../helpers/utilities/tx";
import { task } from "hardhat/config";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";

task(
  `deploy-UiPoolDataProvider`,
  `Deploys the UiPoolDataProvider contract`
).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error("INVALID_CHAIN_ID");
  }

  console.log(
    `\n- UiPoolDataProvider price aggregator: ${
      chainlinkAggregatorProxy[hre.network.name]
    }`
  );
  console.log(
    `\n- UiPoolDataProvider eth/usd price aggregator: ${
      chainlinkEthUsdAggregatorProxy[hre.network.name]
    }`
  );
  console.log(`\n- UiPoolDataProvider deployment`);
  const artifact = await deployContract("UiPoolDataProvider", [
    chainlinkAggregatorProxy[hre.network.name],
    chainlinkEthUsdAggregatorProxy[hre.network.name],
  ]);

  console.log("UiPoolDataProvider:", artifact.address);
  console.log("Network:", hre.network.name);
});
