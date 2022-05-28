import { css } from '@emotion/css';
import { ethers } from 'ethers';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import ReactMarkdown from 'react-markdown';

import Blog from 'artifacts/contracts/Blog.sol/Blog.json';
import { contractAddress, ownerAddress } from 'config';
import { AccountContext } from 'context';
import { IPost } from 'types';

const ipfsURI = 'https://ipfs.io/ipfs/';

const Post = (props: { post: IPost }) => {
  const { account } = useContext(AccountContext);
  const router = useRouter();
  const { id } = router.query;
  const { post } = props;
  const { title, content, coverImage } = props.post;

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
          {coverImage && (
            <div>
              <Image
                src={coverImage}
                alt={title}
                className={coverImageStyle}
                layout='responsive'
                objectFit='cover'
                width={100}
                height={50}
              />
            </div>
          )}
          <h1>{title}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

export const getStaticPaths = async () => {
  let provider;
  const mumbaiNetwork = 'https://rpc-mumbai.matic.today';
  const polygonNetwork = 'https://polygon-rpc.com/';

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

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
  const data = await contract.fetchPosts();
  const paths = data.map((d: string[]) => ({ params: { id: d[2] } }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) return { notFound: true };
  const { id } = params;

  const ipfsUrl = encodeURI(`${ipfsURI}/${id}`);
  const response = await fetch(ipfsUrl);

  try {
    const post = await response.json();

    if (post.coverImage) {
      const coverImage = `${ipfsURI}/${post.coverImage}`;
      post.coverImage = coverImage;
    }

    return { props: { post } };
  } catch (err) {
    return { notFound: true };
  }
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
