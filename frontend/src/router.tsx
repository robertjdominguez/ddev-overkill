import { createBrowserRouter } from 'react-router-dom';
import AppShellLayout from './components/Layout/AppShellLayout';
import Home from './pages/home';
import Posts from './pages/posts';
import Post from './pages/post';

export const router = createBrowserRouter([
  {
    element: <AppShellLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/posts', element: <Posts /> },
      { path: '/posts/:slug', element: <Post /> },
    ],
  },
]);
