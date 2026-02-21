import { useState, useEffect } from 'react';
import { TextInput, Button, Stack, Image, Group, Badge, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from '@/lib/auth';

export interface PostFormValues {
  slug: string;
  title: string;
  hook: string;
  body: string;
  image: string;
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  onPublish?: (values: PostFormValues) => void;
  onUnpublish?: () => void;
  isPublished?: boolean;
  firstPublished?: string | null;
  loading?: boolean;
  submitLabel?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function PostForm({
  initialValues,
  onSubmit,
  onPublish,
  onUnpublish,
  isPublished,
  firstPublished,
  loading,
  submitLabel = 'Save',
}: PostFormProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [hook, setHook] = useState(initialValues?.hook ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');
  const [image, setImage] = useState(initialValues?.image ?? '');
  const [slugManual, setSlugManual] = useState(!!initialValues?.slug);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch('/api/upload-asset?prefix=posts', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: file,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImage(data.url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const getValues = (): PostFormValues => ({ slug, title, hook, body, image });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(getValues());
  };

  const handlePublish = () => {
    onPublish?.(getValues());
  };

  const handleUnpublish = () => {
    modals.openConfirmModal({
      title: 'Unpublish post',
      children: 'This post will no longer be visible to the public. You can re-publish it later.',
      labels: { confirm: 'Unpublish', cancel: 'Cancel' },
      confirmProps: { color: 'yellow' },
      onConfirm: () => onUnpublish?.(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {isPublished !== undefined && (
          <Group>
            <Badge color={isPublished ? 'green' : 'gray'} variant="filled" size="lg">
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
            {firstPublished && (
              <Text size="sm" c="dimmed">
                First published {new Date(firstPublished).toLocaleDateString()}
              </Text>
            )}
          </Group>
        )}
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.currentTarget.value);
            setSlugManual(true);
          }}
          required
        />
        <TextInput
          label="Hook"
          value={hook}
          onChange={(e) => setHook(e.currentTarget.value)}
        />
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
            Image
          </label>
          <Group>
            <Button
              component="label"
              variant="light"
              size="xs"
              loading={uploading}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
              />
            </Button>
            {image && (
              <TextInput
                value={image}
                onChange={(e) => setImage(e.currentTarget.value)}
                style={{ flex: 1 }}
                size="xs"
              />
            )}
          </Group>
          {image && <Image src={image} alt="Preview" mah={200} mt="xs" fit="contain" />}
        </div>
        <div data-color-mode="dark">
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
            Body
          </label>
          <MDEditor
            value={body}
            onChange={(val) => setBody(val ?? '')}
            height={400}
          />
        </div>
        <Group>
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
          {onPublish && !isPublished && (
            <Button color="green" onClick={handlePublish} loading={loading}>
              Publish
            </Button>
          )}
          {onUnpublish && isPublished && (
            <Button variant="light" color="yellow" onClick={handleUnpublish} loading={loading}>
              Unpublish
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
