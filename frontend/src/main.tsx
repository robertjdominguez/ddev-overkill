import { ApolloProvider } from '@apollo/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import './index.css';
import { router } from './router';
import client from './lib/apollo';

const theme = createTheme({
  primaryColor: 'violet',
  fontFamily: 'system-ui, sans-serif',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </MantineProvider>
  </StrictMode>,
);
