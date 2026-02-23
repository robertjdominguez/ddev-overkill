import { gql } from '@apollo/client';

export const GET_ADMIN_POSTS = gql`
  query GetAdminPosts {
    posts(order_by: { createdAt: desc }) {
      id
      slug
      title
      hook
      image
      isPublished
      firstPublished
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
      isPublished
      firstPublished
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
      title
      hook
      body
      image
      isPublished
      firstPublished
      updatedAt
    }
  }
`;

export const PUBLISH_POST = gql`
  mutation PublishPost($id: Int!, $slug: String!, $title: String!, $hook: String, $body: String, $image: String, $firstPublished: timestamptz!) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: { slug: $slug, title: $title, hook: $hook, body: $body, image: $image, isPublished: true, firstPublished: $firstPublished }) {
      id
      slug
      title
      hook
      body
      image
      isPublished
      firstPublished
      updatedAt
    }
  }
`;

export const UNPUBLISH_POST = gql`
  mutation UnpublishPost($id: Int!) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: { isPublished: false }) {
      id
      isPublished
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
