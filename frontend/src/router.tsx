import { createBrowserRouter } from 'react-router-dom';
import AppShellLayout from './components/Layout/AppShellLayout';
import Home from './pages/home';
import Posts from './pages/posts';
import Post from './pages/post';
import PostsLayout from './pages/posts/components/PostsLayout';
import RequireAuth from './components/Auth/RequireAuth';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPosts from './pages/admin/posts/AdminPosts';
import AdminPostCreate from './pages/admin/posts/AdminPostCreate';
import AdminPostEdit from './pages/admin/posts/AdminPostEdit';

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
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminPosts /> },
      { path: 'posts', element: <AdminPosts /> },
      { path: 'posts/new', element: <AdminPostCreate /> },
      { path: 'posts/:id/edit', element: <AdminPostEdit /> },
    ],
  },
]);
