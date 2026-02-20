import { Button, Text } from '@mantine/core';
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
    <div className={classes.entry}>
      <Text fw={700} size="xl">{post.title}</Text>
      {date && (
        <Text size="xs" c="dimmed" tt="uppercase">
          {date}
        </Text>
      )}
      {post.hook && (
        <Text size="sm" c="dimmed">{post.hook}</Text>
      )}
      <Button component={Link} to={`/posts/${post.slug}`} variant="light" radius="sm" size="sm" ml="auto" className={classes.readMore}>
        Read more <span className={classes.arrow}>&rarr;</span>
      </Button>
    </div>
  );
}
