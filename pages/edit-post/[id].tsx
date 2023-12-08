import { css } from '@emotion/css';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import Blog from 'artifacts/contracts/Blog.sol/Blog.json';
import { contractAddress } from 'config';
import { IPost } from 'types';
import { getJsonRpcProvider, getWeb3Provider } from 'utils/ethers-util';
import { fetchIpfsMetadata, getIpfsUrl, saveToIpfs } from 'utils/ipfs';
import { MDE } from 'utils/mde';

const EditPost = () => {
  const [post, setPost] = useState<IPost>();
  const [editing, setEditing] = useState(true);
  const router = useRouter();
  const id = encodeURI(String(router.query.id));

  const updatePost = async () => {
    if (!post) return;

    const hash = await saveToIpfs(post);
    const { provider, signer } = getWeb3Provider();
    if (!provider || !signer) return;
    const contract = new ethers.Contract(contractAddress, Blog.abi, signer);
    await contract.updatePost(post.id, post.title, hash, true);
    router.push('/');
  };

  useMemo(async () => {
    if (!id) return;

    const provider = getJsonRpcProvider();
    const contract = new ethers.Contract(contractAddress, Blog.abi, provider);

    try {
      const val: number[] = await contract.fetchPost(id);
      const postId = val[0];

      const data = await fetchIpfsMetadata(id);
      if (!data) return;

      if (data.coverImage) {
        const coverImagePath = getIpfsUrl(data.coverImage);
        data.coverImage = coverImagePath;
      }
      data.id = postId;

      setPost(data);
    } catch (err) {
      console.log('error: ', err);
    }
  }, [id]);

  if (!post) return null;
  return (
    <div className={container}>
      {editing && (
        <div>
          <input
            className={titleStyle}
            type='text'
            name='title'
            placeholder='Give it a title...'
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
          <MDE
            className={mdEditor}
            placeholder='Content goes here...'
            value={post.content}
            onChange={(value) => setPost({ ...post, content: value })}
          />
          <button className={button} onClick={updatePost}>
            Update post
          </button>
        </div>
      )}
      {!editing && (
        <div>
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt='Cover image'
              className={coverImageStyle}
              layout='responsive'
              objectFit='cover'
              width={100}
              height={50}
            />
          )}
          <h1>{post.title}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
      <button className={button} onClick={() => setEditing(!editing)}>
        {editing ? 'View post' : 'Edit post'}
      </button>
    </div>
  );
};

export default EditPost;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 15px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`;

const mdEditor = css`
  margin-top: 40px;
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
