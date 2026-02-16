import { useGetPostsQuery, type PostFieldsFragment } from '@/generated/graphql';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import EmptyPosts from './EmptyPosts';

export default function AllPosts() {
  const { data, loading, error } = useGetPostsQuery();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.posts.length) return <EmptyPosts />;

  return (
    <ul>
      {data.posts.map((post: PostFieldsFragment) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
