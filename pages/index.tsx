import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { css } from '@emotion/css';
import { ethers } from 'ethers';
import { AccountContext } from '../context';
import { contractAddress, ownerAddress } from '../config';
import Blog from '../artifacts/contracts/Blog.sol/Blog.json';

const Home = (props) => {
  const { posts } = props;
  const account = useContext(AccountContext);
  const router = useRouter();

  return (
    <div>
      <div className={postList}>
        {posts.map((post, index) => (
          <Link href={`/post/${post[2]}`} key={index}>
            <a>
              <div className={linkStyle}>
                <p className={postTitle}>{post[1]}</p>
                <div className={arrowContainer}>
                  <Image
                    src='/right-arrow.svg'
                    alt='Right arrow'
                    className={smallArrow}
                    width={35}
                    height={35}
                  />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className={container}>
        {account === ownerAddress && posts && !posts.length && (
          <button
            className={buttonStyle}
            onClick={async () => router.push('/create-post')}
          >
            Create your first post
            <div className='img-container' style={{ marginLeft: 35 }}>
              <Image
                src='/right-arrow.svg'
                alt='Right arrow'
                width={35}
                height={35}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
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

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)),
    },
  };
};

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`;

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`;

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`;

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;
`;

const container = css`
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  display: flex;
  align-items: center;
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const smallArrow = css`
  width: 25px;
`;
