import { Card, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { PostFieldsFragment } from '@/generated/graphql';
import classes from './PostPreview.module.css';

export default function PostPreview({ post }: { post: PostFieldsFragment }) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null;

  return (
    <Card
      component={Link}
      to={`/posts/${post.slug}`}
      padding="md"
      withBorder
      className={classes.card}
      h={200}
    >
      <Stack gap="xs" flex={1}>
        {date && (
          <Text size="xs" c="accent.5" tt="uppercase" fw={400}>
            {date}
          </Text>
        )}
        <Text fw={700} size="lg" lineClamp={2}>{post.title}</Text>
        {post.hook && (
          <Text size="sm" c="dimmed" lineClamp={3} mt="auto">{post.hook}</Text>
        )}
      </Stack>
    </Card>
  );
}
