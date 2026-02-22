import { gql } from '@apollo/client';

export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsletter($email: String!) {
    insert_newsletter_subscribers(objects: [{ email: $email }]) {
      affected_rows
    }
  }
`;
