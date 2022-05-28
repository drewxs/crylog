import { css } from '@emotion/css';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import Blog from 'artifacts/contracts/Blog.sol/Blog.json';
import { contractAddress } from 'config';
import { getWeb3Provider } from 'utils/ethers-util';
import { client, saveToIpfs } from 'utils/ipfs';
import { MDE } from 'utils/mde';

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' });
  const [image, setImage] = useState<File>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const { title, content } = post;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  const onChange = (e: { target: { name: string; value: string } }) => {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  };

  const createNewPost = async () => {
    if (!title || !content) return;

    const hash = await saveToIpfs(post);
    if (hash) await savePost(hash);

    router.push(`/`);
  };

  const savePost = async (hash: string) => {
    if (typeof window.ethereum === 'undefined') return;

    const web3 = getWeb3Provider();
    const { provider, signer } = web3;
    if (!provider || !signer) return;

    const contract = new ethers.Contract(contractAddress, Blog.abi, signer);

    try {
      const val = await contract.createPost(post.title, hash);

      // optional - wait for transaction to be confirmed before rerouting
      await provider.waitForTransaction(val.hash);

      console.log('val: ', val);
    } catch (err) {
      console.log('error: ', err);
    }
  };

  const triggerOnChange = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const uploadedFile = e.target.files[0];
    const added = await client.add(uploadedFile);

    setPost((state) => ({ ...state, coverImage: added.path }));
    setImage(uploadedFile);
  };

  return (
    <div className={container}>
      {image && (
        <Image
          src={URL.createObjectURL(image)}
          alt='Cover image'
          layout='responsive'
          objectFit='cover'
          width={100}
          height={50}
        />
      )}
      <input
        onChange={onChange}
        name='title'
        placeholder='Give it a title...'
        value={post.title}
        className={titleStyle}
      />
      <MDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      {loaded && (
        <>
          <button className={button} type='button' onClick={createNewPost}>
            Publish
          </button>
          <button onClick={triggerOnChange} className={button}>
            Add cover image
          </button>
        </>
      )}
      <input
        id='selectImage'
        className={hiddenInput}
        type='file'
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  );
};

export default CreatePost;

const hiddenInput = css`
  display: none;
`;

const mdEditor = css`
  margin-top: 40px;
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

const container = css`
  width: 800px;
  margin: 0 auto;
`;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;
