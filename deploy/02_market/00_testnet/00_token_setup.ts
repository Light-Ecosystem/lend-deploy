import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { COMMON_DEPLOY_PARAMS } from '../../../helpers/env';
import {
  checkRequiredEnvironment,
  ConfigNames,
  getRequiredParamPerNetwork,
  isProductionMarket,
  loadPoolConfig,
} from '../../../helpers/market-config-helpers';
import { eNetwork, ITokenAddress } from '../../../helpers/types';
import { FAUCET_ID, TESTNET_TOKEN_PREFIX } from '../../../helpers/deploy-ids';
import Bluebird from 'bluebird';
import { MARKET_NAME } from '../../../helpers/env';
import MintableERC20Artifact from '../../../extendedArtifacts/MintableERC20.json';
import WETH9MockedArtifact from '../../../extendedArtifacts/WETH9Mocked.json';
import { CORE_VERSION } from '../../../helpers';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy, save } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;

  if (isProductionMarket(poolConfig)) {
    console.log('[Deployment] Skipping testnet token setup at production market');
    // Early exit if is not a testnet market
    return true;
  }

  console.log(`- Setting up testnet tokens for "${MARKET_NAME}" market at "${network}" network`);

  const reservesConfig = poolConfig.ReservesConfig;
  const reserveSymbols = Object.keys(reservesConfig);

  if (reserveSymbols.length === 0) {
    console.warn('Market Config does not contain ReservesConfig. Skipping testnet token setup.');
    return true;
  }

  // 0. Deployment of Faucet helperx contract
  console.log('- Deployment of Faucet contract');
  const faucet = await deploy(FAUCET_ID, {
    from: deployer,
    contract: 'ERC20Faucet',
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  // 1. Deployment of ERC20 mintable tokens for testing purposes
  await Bluebird.each(reserveSymbols, async (symbol) => {
    if (!reservesConfig[symbol]) {
      throw `[Deployment] Missing token "${symbol}" at ReservesConfig`;
    }
    if (symbol == poolConfig.WrappedNativeTokenSymbol) {
      await deploy(`${poolConfig.WrappedNativeTokenSymbol}${TESTNET_TOKEN_PREFIX}`, {
        from: deployer,
        contract: 'WETH9Mocked',
        args: [
          poolConfig.WrappedNativeTokenSymbol,
          poolConfig.WrappedNativeTokenSymbol,
          faucet.address,
        ],
        ...COMMON_DEPLOY_PARAMS,
      });
    } else {
      if (symbol !== 'stHOPE' && symbol !== 'HOPE') {
        await deploy(`${symbol}${TESTNET_TOKEN_PREFIX}`, {
          from: deployer,
          contract: 'MintableERC20',
          args: [symbol, symbol, reservesConfig[symbol].reserveDecimals, faucet.address],
          ...COMMON_DEPLOY_PARAMS,
        });
      }
    }
  });

  console.log(
    '[Deployment][WARNING] Remember to setup the above testnet addresses at the ReservesConfig field inside the market configuration file and reuse testnet tokens'
  );
  console.log(
    '[Deployment][WARNING] Remember to setup the Native Token Wrapper (ex WETH or WMATIC) at `helpers/constants.ts`'
  );
  return true;
};

func.id = `MockTestnetToken:${MARKET_NAME}:lend-core@${CORE_VERSION}`;

func.tags = ['market', 'init-testnet', 'token-setup'];

func.dependencies = ['before-deploy', 'periphery-pre'];

func.skip = async () => checkRequiredEnvironment();

export default func;
