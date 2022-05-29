import fs from 'fs';
import hre from 'hardhat';

/**
 * Deploys a contract, gets the address of the contract and the address of the owner, and writes
 * them to config.ts.
 */
const main = async () => {
  const Blog = await hre.ethers.getContractFactory('Blog');
  const blog = await Blog.deploy('Test blog');
  const address = await blog.signer.getAddress();

  await blog.deployed();
  console.log(`Blog deployed to: ${blog.address}`);

  const path = './config.ts';
  const content = `export const contractAddress = '${blog.address}';\nexport const ownerAddress = '${address}';`;

  fs.writeFileSync(path, content);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default main;
