import { gql } from '@apollo/client';

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    posts(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      slug
      title
      hook
      body
      image
      createdAt
      similarPosts(limit: 5) {
        id
        slug
        title
        hook
        image
        createdAt
      }
    }
  }
`;
