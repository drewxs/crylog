import { ParsedUrlQuery } from 'querystring';

export interface IPost extends ParsedUrlQuery {
  id: string;
  title: string;
  content: string;
  coverImage: string;
}
