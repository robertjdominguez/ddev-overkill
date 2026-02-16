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
  query GetPosts($limit: Int, $offset: Int) {
    posts(order_by: { createdAt: desc }, limit: $limit, offset: $offset) {
      ...PostFields
    }
    posts_aggregate {
      aggregate {
        count
      }
    }
  }
`;
