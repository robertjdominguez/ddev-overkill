import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import PostForm, { type PostFormValues } from './components/PostForm';
import { INSERT_POST } from '../data/queries';

export default function AdminPostCreate() {
  const navigate = useNavigate();
  const creating = useRef(false);

  const [insertPost] = useMutation(INSERT_POST, {
    onCompleted: (data) => {
      notifications.show({ message: 'Post created', color: 'green' });
      navigate(`/admin/posts/${data.insert_posts_one.id}/edit`, { replace: true });
    },
    onError: (err) => {
      creating.current = false;
      notifications.show({ message: err.message, color: 'red' });
    },
  });

  const handleAutoSave = useCallback(
    (values: PostFormValues) => {
      if (creating.current || !values.title.trim()) return;
      creating.current = true;
      insertPost({ variables: values });
    },
    [insertPost],
  );

  return (
    <>
      <Title order={2} mb="md">New Post</Title>
      <PostForm onAutoSave={handleAutoSave} />
    </>
  );
}
