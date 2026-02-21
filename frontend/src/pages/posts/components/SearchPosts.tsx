import { useEffect } from 'react';
import { CloseButton, Skeleton, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { Search } from 'lucide-react';
import { useSearchPostsLazyQuery } from '@/generated/graphql';
import SearchResult from './SearchResult';
import classes from './SearchPosts.module.css';

function ResultSkeleton() {
  return (
    <div style={{ padding: 'var(--mantine-spacing-md) 0' }}>
      <Skeleton height={10} width="40%" />
      <Skeleton height={22} width="70%" mt="xs" />
      <Skeleton height={14} mt="sm" />
      <Skeleton height={14} mt={4} width="85%" />
      <Skeleton height={30} width={110} mt="sm" radius="sm" style={{ marginLeft: 'auto' }} />
    </div>
  );
}

interface SearchPostsProps {
  onSearchActive: (active: boolean) => void;
}

export default function SearchPosts({ onSearchActive }: SearchPostsProps) {
  const [value, setValue] = useInputState('');
  const [debounced] = useDebouncedValue(value, 300);

  const [search, { data, loading }] = useSearchPostsLazyQuery();

  const active = debounced.trim().length > 0;

  useEffect(() => {
    if (active) {
      search({ variables: { query: debounced.trim(), limit: 20 } });
    }
  }, [debounced, active, search]);

  useEffect(() => {
    onSearchActive(active);
  }, [active, onSearchActive]);

  const results = data?.searchPosts ?? [];

  return (
    <div className={classes.wrapper}>
      <TextInput
        placeholder="Search posts..."
        leftSection={<Search size={16} />}
        rightSection={value ? <CloseButton size="sm" onClick={() => setValue('')} /> : null}
        value={value}
        onChange={setValue}
      />
      {active && (
        <Stack gap="lg">
          {loading && Array.from({ length: 3 }, (_, i) => <ResultSkeleton key={i} />)}
          {!loading && results.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No results found
            </Text>
          )}
          {!loading && results.map((result) => (
            <SearchResult key={result.id} result={result} />
          ))}
        </Stack>
      )}
    </div>
  );
}
