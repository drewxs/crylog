import { create } from 'ipfs-http-client';

const ipfsURI = 'https://ipfs.io/ipfs/';

export const client = create({
  protocol: 'https',
  host: 'ipfs.infura.io',
  port: 5001,
  apiPath: '/api/v0',
});

export const getIpfsUrl = (hash: string) => {
  const ipfsUrl = `${ipfsURI}/${encodeURI(hash)}`;

  return ipfsUrl;
};

export const fetchIpfsMetadata = async (hash: string) => {
  try {
    const ipfsUrl = getIpfsUrl(hash);
    const response = await fetch(ipfsUrl);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};

export const saveToIpfs = async (data: object) => {
  try {
    const newData = await client.add(JSON.stringify(data));
    return newData.path;
  } catch (err) {
    console.log('error: ', err);
  }
};
