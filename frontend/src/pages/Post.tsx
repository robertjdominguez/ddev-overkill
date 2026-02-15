import { useParams } from 'react-router-dom'

export default function Post() {
  const { slug } = useParams()
  return (
    <div>
      <h1>Post: {slug}</h1>
      <p>Single post view coming soon</p>
    </div>
  )
}
