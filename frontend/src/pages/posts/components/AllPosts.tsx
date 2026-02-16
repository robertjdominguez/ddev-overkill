import { useGetPostsQuery, type PostFieldsFragment } from '@/generated/graphql';

export default function AllPosts() {
  const { data, loading, error } = useGetPostsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.posts.map((post: PostFieldsFragment) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
