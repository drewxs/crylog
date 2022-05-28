import { ethers } from 'ethers';

export const getWeb3Provider = () => {
  if (typeof window.ethereum === 'undefined') {
    return { provider: null, signer: null };
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return { provider, signer };
};

export const getJsonRpcProvider = () => {
  const mumbaiNetwork = 'https://rpc-mumbai.matic.today';
  const polygonNetwork = 'https://polygon-rpc.com';

  let provider;

  switch (process.env.ENVIRONMENT) {
    case 'local':
      provider = new ethers.providers.JsonRpcProvider();
      break;
    case 'testnet':
      provider = new ethers.providers.JsonRpcProvider(mumbaiNetwork);
      break;
    default:
      provider = new ethers.providers.JsonRpcProvider(polygonNetwork);
  }

  return provider;
};
