import { Routes, Route } from 'react-router-dom';
import AppShellLayout from './components/Layout/AppShellLayout';
import Home from './pages/home';
import Posts from './pages/posts';
import Post from './pages/post';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<AppShellLayout />}>
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<Post />} />
      </Route>
    </Routes>
  );
}

export default App;
