import '@nomiclabs/hardhat-waffle';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    hardhat: { chainId: 1337 },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};

export default config;
