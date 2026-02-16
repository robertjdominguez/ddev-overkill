import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;
