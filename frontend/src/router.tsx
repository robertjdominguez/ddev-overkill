import { createBrowserRouter } from 'react-router-dom';
import AppShellLayout from './components/Layout/AppShellLayout';
import Home from './pages/home';
import Posts from './pages/posts';
import Post from './pages/post';
import PostsLayout from './pages/posts/components/PostsLayout';

export const router = createBrowserRouter([
  {
    element: <AppShellLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        element: <PostsLayout />,
        children: [
          { path: '/posts', element: <Posts /> },
          { path: '/posts/:slug', element: <Post /> },
        ],
      },
    ],
  },
]);
