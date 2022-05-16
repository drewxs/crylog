require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: './.env.local' });

module.exports = {
	solidity: '0.8.4',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: 'https://rpc-mumbai.matic.today',
			accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		},
		// polygon: {
		//   url: 'https://polygon-rpc.com/',
		//   accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		// },
	},
};
