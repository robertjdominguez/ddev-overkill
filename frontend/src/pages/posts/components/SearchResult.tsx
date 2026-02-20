import { Badge, Button, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { SearchPostsQuery } from '@/generated/graphql';
import classes from './PostPreview.module.css';

type Result = SearchPostsQuery['searchPosts'][number];

export default function SearchResult({ result }: { result: Result }) {
  const date = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const pct = `${Math.round(result.similarity * 100)}%`;

  return (
    <div className={classes.entry}>
      <Text fw={700} size="xl">{result.title}</Text>
      <Group gap="xs">
        {date && (
          <Text size="xs" c="dimmed" tt="uppercase">
            {date}
          </Text>
        )}
        <Badge size="xs" variant="light" color="accent">
          {pct} match
        </Badge>
      </Group>
      {result.hook && (
        <Text size="sm" c="dimmed">{result.hook}</Text>
      )}
      <Button component={Link} to={`/posts/${result.slug}`} variant="light" radius="sm" size="sm" ml="auto" className={classes.readMore}>
        Read more <span className={classes.arrow}>&rarr;</span>
      </Button>
    </div>
  );
}
