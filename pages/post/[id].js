import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { css } from '@emotion/css';
import { ethers } from 'ethers';
import { AccountContext } from '../../context';
import { contractAddress, ownerAddress } from '../../config';
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json';

const ipfsURI = 'https://ipfs.io/ipfs/';

const Post = ({ post }) => {
	const account = useContext(AccountContext);
	const router = useRouter();
	const { id } = router.query;

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{post && (
				<div className={container}>
					{ownerAddress === account && (
						<div className={editPost}>
							<Link href={`/edit-post/${id}`}>
								<a>Edit post</a>
							</Link>
						</div>
					)}
					{post.coverImage && (
						<div>
							<Image
								src={post.coverImage}
								alt={post.title}
								className={coverImageStyle}
								layout='responsive'
								objectFit='cover'
								width={100}
								height={50}
							/>
						</div>
					)}
					<h1>{post.title}</h1>
					<div className={contentContainer}>
						<ReactMarkdown>{post.content}</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
};

export default Post;

export const getStaticPaths = async () => {
	let provider;

	if (process.env.ENVIRONMENT === 'local') {
		provider = new ethers.providers.JsonRpcProvider();
	} else if (process.env.ENVIRONMENT === 'testnet') {
		provider = new ethers.providers.JsonRpcProvider(
			'https://rpc-mumbai.matic.today'
		);
	} else {
		provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');
	}

	const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
	const data = await contract.fetchPosts();
	const paths = data.map((d) => ({ params: { id: d[2] } }));

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps = async ({ params }) => {
	const { id } = params;
	const ipfsUrl = `${ipfsURI}/${id}`;
	const response = await fetch(ipfsUrl);
	const data = await response.json();

	if (data.coverImage) {
		let coverImage = `${ipfsURI}/${data.coverImage}`;
		data.coverImage = coverImage;
	}

	return {
		props: {
			post: data,
		},
	};
};

const editPost = css`
	margin: 20px 0px;
`;

const coverImageStyle = css`
	width: 900px;
`;

const container = css`
	width: 900px;
	margin: 0 auto;
`;

const contentContainer = css`
	margin-top: 60px;
	padding: 0px 40px;
	border-left: 1px solid #e7e7e7;
	border-right: 1px solid #e7e7e7;
	& img {
		max-width: 900px;
	}
`;
