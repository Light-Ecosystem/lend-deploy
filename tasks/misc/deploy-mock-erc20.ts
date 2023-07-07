import { task } from 'hardhat/config';
import { ZERO_ADDRESS, deployContract } from '../../helpers';
task(`deploy-mock-erc20`, `Deploys mock erc20`)
  .addParam('symbol', 'The ERC20 symbol')
  .addOptionalParam('decimal', 'The ERC20 decimal')
  .setAction(async ({ symbol, decimal }, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }
    if (symbol == 'WETH') {
      await deployContract('WETH9Mocked', [
        symbol,
        symbol,
        decimal == null ? 18 : decimal,
        ZERO_ADDRESS,
      ]);
    } else {
      await deployContract('MintableERC20', [
        symbol,
        symbol,
        decimal == null ? 18 : decimal,
        ZERO_ADDRESS,
      ]);
    }
  });
