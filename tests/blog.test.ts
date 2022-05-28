import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Blog', () => {
  it('Should create a post', async () => {
    const Blog = await ethers.getContractFactory('Blog');
    const blog = await Blog.deploy('Test blog');
    await blog.deployed();
    await blog.createPost('Test post', 'Test content');

    const posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal('Test post');
  });

  it('Should edit a post', async () => {
    const Blog = await ethers.getContractFactory('Blog');
    const blog = await Blog.deploy('Test blog');
    await blog.deployed();

    await blog.createPost('Test post', 'Test content');
    await blog.updatePost(1, 'Updated post', 'Updated content', true);

    const posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal('Updated post');
  });

  it('Should update the name', async () => {
    const Blog = await ethers.getContractFactory('Blog');
    const blog = await Blog.deploy('Test blog');
    await blog.deployed();

    let name = await blog.name();
    expect(name).to.equal('Test blog');

    await blog.updateName('Updated blog name');
    name = await blog.name();
    expect(name).to.equal('Updated blog name');
  });
});
