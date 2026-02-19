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
  primaryColor: 'accent',
  fontFamily: 'Cabin, sans-serif',
  colors: {
    accent: [
      '#eeeeff',
      '#d4d3fa',
      '#b9b8f7',
      '#9e9cf4',
      '#8381f2',
      '#7573f5',
      '#504df9',
      '#403ec7',
      '#302e96',
      '#201f64',
    ],
    dark: [
      '#f2f2f2',
      '#a9adc1',
      '#8b8fa6',
      '#6d718b',
      '#4f5370',
      '#313556',
      '#12102e',
      '#020113',
      '#010010',
      '#00000a',
    ],
  },
  headings: {
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '32px' },
      h2: { fontSize: '24px' },
      h3: { fontSize: '24px' },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </MantineProvider>
  </StrictMode>,
);
