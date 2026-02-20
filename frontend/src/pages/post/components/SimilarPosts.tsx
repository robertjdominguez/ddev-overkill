import { SimpleGrid, Text, Title, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { PostFieldsFragment } from '@/generated/graphql';

export default function SimilarPosts({ posts }: { posts: PostFieldsFragment[] }) {
  if (posts.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
      <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
        Keep reading
      </Text>
      <Text size="xs" c="dimmed" mb={8}>
        Check out these similar posts.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {posts.map((post) => (
          <UnstyledButton
            key={post.id}
            component={Link}
            to={`/posts/${post.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: 'var(--mantine-spacing-md)',
              borderRadius: 'var(--mantine-radius-sm)',
              border: '1px solid var(--mantine-color-default-border)',
              transition: 'border-color 150ms ease',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = 'var(--mantine-color-dimmed)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = 'var(--mantine-color-default-border)';
            }}
          >
            <Title order={5} lineClamp={2}>
              {post.title}
            </Title>
            {post.hook && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {post.hook}
              </Text>
            )}
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </div>
  );
}
