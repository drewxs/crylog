import fs from 'fs';
import hre from 'hardhat';

const main = async () => {
  const Blog = await hre.ethers.getContractFactory('Blog');
  const blog = await Blog.deploy('Test blog');
  const address = await blog.signer.getAddress();

  await blog.deployed();
  console.log(`Blog deployed to: ${blog.address}`);

  fs.writeFileSync(
    './config.ts',
    `export const contractAddress: string = "${blog.address}";\nexport const ownerAddress: string = "${address}";`
  );
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default main;
