import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts(order_by: { createdAt: desc }) {
      id
      slug
      title
      hook
      image
      createdAt
    }
  }
`;
