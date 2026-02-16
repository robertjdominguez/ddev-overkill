import { gql } from '@apollo/client';

export const POST_FRAGMENT = gql`
  fragment PostFields on posts {
    id
    slug
    title
    hook
    image
    createdAt
  }
`;

export const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query GetPosts {
    posts(order_by: { createdAt: desc }) {
      ...PostFields
    }
  }
`;
