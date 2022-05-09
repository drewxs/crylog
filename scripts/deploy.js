const hre = require('hardhat');
const fs = require('fs');

const main = async () => {
	const Blog = await hre.ethers.getContractFactory('Blog');
	const blog = await Blog.deploy('Test blog');

	await blog.deployed();
	console.log(`Blog deployed to: ${blog.address}`);

	fs.writeFileSync(
		'./config.js',
		`export const contractAddress = "${blog.address}";\nexport const ownerAddress = "${blog.signer.address}";`
	);
};

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
