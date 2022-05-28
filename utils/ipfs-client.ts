import { create } from 'ipfs-http-client';

export const client = create({
  protocol: 'https',
  host: 'ipfs.infura.io',
  port: 5001,
  apiPath: '/api/v0',
});
