import { useEffect, useRef, useCallback } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useState } from 'react';
import type { PostFormValues } from '../components/PostForm';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function valuesEqual(a: PostFormValues, b: PostFormValues): boolean {
  return (
    a.slug === b.slug &&
    a.title === b.title &&
    a.hook === b.hook &&
    a.body === b.body &&
    a.image === b.image
  );
}

export function useAutoSave(
  values: PostFormValues,
  save: (values: PostFormValues) => Promise<void>,
) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [debounced] = useDebouncedValue(values, 1500);
  const lastSaved = useRef<PostFormValues>(values);
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    if (valuesEqual(debounced, lastSaved.current)) return;

    let cancelled = false;
    setStatus('saving');
    save(debounced).then(
      () => {
        if (cancelled) return;
        lastSaved.current = debounced;
        setSavedAt(new Date());
        setStatus('saved');
      },
      () => {
        if (cancelled) return;
        setStatus('error');
      },
    );

    return () => {
      cancelled = true;
    };
  }, [debounced, save]);

  const resetLastSaved = useCallback((v: PostFormValues) => {
    lastSaved.current = v;
  }, []);

  return { status, savedAt, resetLastSaved };
}
