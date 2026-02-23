import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Title, Loader, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import PostForm, { type PostFormValues } from './components/PostForm';
import { GET_POST_FOR_EDIT, UPDATE_POST, PUBLISH_POST, UNPUBLISH_POST } from '../data/queries';
import { useAutoSave, type AutoSaveStatus } from './hooks/useAutoSave';

function EditForm({
  post,
  postId,
}: {
  post: { slug: string; title: string; hook?: string | null; body?: string | null; image?: string | null; isPublished: boolean; firstPublished?: string | null };
  postId: number;
}) {
  const [formValues, setFormValues] = useState<PostFormValues>({
    slug: post.slug,
    title: post.title,
    hook: post.hook ?? '',
    body: post.body ?? '',
    image: post.image ?? '',
  });

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST);

  const [publishPost, { loading: publishLoading }] = useMutation(PUBLISH_POST, {
    onCompleted: () => {
      notifications.show({ message: 'Post published', color: 'green' });
    },
    onError: (err) => {
      notifications.show({ message: err.message, color: 'red' });
    },
  });

  const [unpublishPost, { loading: unpublishLoading }] = useMutation(UNPUBLISH_POST, {
    onCompleted: () => {
      notifications.show({ message: 'Post unpublished', color: 'yellow' });
    },
    onError: (err) => {
      notifications.show({ message: err.message, color: 'red' });
    },
  });

  const autoSave = useCallback(
    async (values: PostFormValues) => {
      await updatePost({ variables: { id: postId, ...values } });
    },
    [updatePost, postId],
  );

  const { status: autoSaveStatus, savedAt: autoSavedAt, resetLastSaved } = useAutoSave(formValues, autoSave);

  const mutationLoading = publishLoading || unpublishLoading;

  const handleAutoSave = useCallback((values: PostFormValues) => {
    setFormValues(values);
  }, []);

  const handlePublish = (values: PostFormValues) => {
    resetLastSaved(values);
    publishPost({
      variables: {
        id: postId,
        ...values,
        firstPublished: post.firstPublished ?? new Date().toISOString(),
      },
    });
  };

  const handleUnpublish = () => {
    unpublishPost({ variables: { id: postId } });
  };

  // Suppress notification for auto-saves
  const effectiveStatus: AutoSaveStatus = updateLoading && autoSaveStatus === 'saving'
    ? 'saving'
    : autoSaveStatus;

  return (
    <PostForm
      initialValues={{
        slug: post.slug,
        title: post.title,
        hook: post.hook ?? '',
        body: post.body ?? '',
        image: post.image ?? '',
      }}
      onPublish={handlePublish}
      onUnpublish={handleUnpublish}
      onAutoSave={handleAutoSave}
      autoSaveStatus={effectiveStatus}
      autoSavedAt={autoSavedAt}
      isPublished={post.isPublished}
      firstPublished={post.firstPublished}
      loading={mutationLoading}
    />
  );
}

export default function AdminPostEdit() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id!, 10);

  const { data, loading: queryLoading, error } = useQuery(GET_POST_FOR_EDIT, {
    variables: { id: postId },
  });

  if (queryLoading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  const post = data?.posts_by_pk;
  if (!post) return <Alert color="red">Post not found</Alert>;

  return (
    <>
      <Title order={2} mb="md">Edit Post</Title>
      <EditForm post={post} postId={postId} />
    </>
  );
}
