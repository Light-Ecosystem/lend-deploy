import { task } from "hardhat/config";
import { diff, formatters } from "jsondiffpatch";

interface HTokenConfig {
  revision: string;
  name: string;
  symbol: string;
  decimals: string;
  treasury: string;
  incentives: string;
  pool: string;
  underlying: string;
}

task(`upgrade-htokens-and-review`)
  .addParam("revision")
  .setAction(
    async ({ revision }, { deployments, getNamedAccounts, ...hre }) => {
      const previousHTokenConfigs: { [key: string]: HTokenConfig } =
        await hre.run("review-htokens", { log: true });

      // Perform Action
      const tokensUpgraded = await hre.run("upgrade-htokens", { revision });
      if (tokensUpgraded) {
      }

      const afterHTokensConfig: { [key: string]: HTokenConfig } = await hre.run(
        "review-htokens",
        { log: true }
      );

      // Checks
      const delta = diff(afterHTokensConfig, previousHTokenConfigs);
      if (delta) {
        console.log(
          "=== Updated HTokens, check new configuration differences ==="
        );
        console.log(formatters.console.format(delta, afterHTokensConfig));
      } else {
        console.log("- HTokens are not upgraded, check logs, noop");
      }
    }
  );
