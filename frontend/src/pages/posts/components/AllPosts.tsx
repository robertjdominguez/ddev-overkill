import { useEffect, useRef } from 'react';
import { NetworkStatus } from '@apollo/client';
import { Skeleton, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useGetPostsQuery, type PostFieldsFragment } from '@/generated/graphql';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import EmptyPosts from './EmptyPosts';
import PostPreview from './PostPreview';

const PAGE_SIZE = 12;

function PostSkeleton() {
  return (
    <div style={{ padding: 'var(--mantine-spacing-md) 0' }}>
      <Skeleton height={10} width="40%" />
      <Skeleton height={22} width="70%" mt="xs" />
      <Skeleton height={14} mt="sm" />
      <Skeleton height={14} mt={4} width="85%" />
      <Skeleton height={30} width={110} mt="sm" radius="xl" />
    </div>
  );
}

export default function AllPosts() {
  const { data, error, fetchMore, networkStatus } = useGetPostsQuery({
    variables: { limit: PAGE_SIZE, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const fetchingMore = useRef(false);

  const { ref, entry } = useIntersection({ threshold: 0.1 });

  const totalCount = data?.posts_aggregate.aggregate?.count ?? 0;
  const loadedCount = data?.posts.length ?? 0;
  const hasMore = loadedCount < totalCount;
  const remainingCount = Math.min(PAGE_SIZE, totalCount - loadedCount);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !fetchingMore.current) {
      fetchingMore.current = true;
      fetchMore({
        variables: { offset: loadedCount },
      }).finally(() => {
        fetchingMore.current = false;
      });
    }
  }, [entry?.isIntersecting, hasMore, loadedCount, fetchMore]);

  if (networkStatus === NetworkStatus.loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.posts.length) return <EmptyPosts />;

  return (
    <Stack gap="lg">
      {data.posts.map((post: PostFieldsFragment) => (
        <PostPreview key={post.id} post={post} />
      ))}
      {hasMore && (
        <>
          <div ref={ref} />
          {Array.from({ length: remainingCount }, (_, i) => (
            <PostSkeleton key={`skeleton-${i}`} />
          ))}
        </>
      )}
    </Stack>
  );
}
