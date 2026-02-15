import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Posts from './pages/Posts'
import Post from './pages/Post'

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
