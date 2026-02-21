import { gql } from '@apollo/client';

export const GET_ADMIN_POSTS = gql`
  query GetAdminPosts {
    posts(order_by: { createdAt: desc }) {
      id
      slug
      title
      hook
      image
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_FOR_EDIT = gql`
  query GetPostForEdit($id: Int!) {
    posts_by_pk(id: $id) {
      id
      slug
      title
      hook
      body
      image
      createdAt
      updatedAt
    }
  }
`;

export const INSERT_POST = gql`
  mutation InsertPost($slug: String!, $title: String!, $hook: String, $body: String, $image: String) {
    insert_posts_one(object: { slug: $slug, title: $title, hook: $hook, body: $body, image: $image }) {
      id
      slug
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $slug: String!, $title: String!, $hook: String, $body: String, $image: String) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: { slug: $slug, title: $title, hook: $hook, body: $body, image: $image }) {
      id
      slug
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    delete_posts_by_pk(id: $id) {
      id
    }
  }
`;
