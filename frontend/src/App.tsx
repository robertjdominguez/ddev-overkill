import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Posts from './pages/posts'
import Post from './pages/post'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:slug" element={<Post />} />
    </Routes>
  )
}

export default App
