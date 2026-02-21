import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import PostForm, { type PostFormValues } from './components/PostForm';
import { INSERT_POST } from '../data/queries';

export default function AdminPostCreate() {
  const navigate = useNavigate();
  const [insertPost, { loading }] = useMutation(INSERT_POST, {
    onCompleted: (data) => {
      notifications.show({ message: 'Post created', color: 'green' });
      navigate(`/admin/posts/${data.insert_posts_one.id}/edit`);
    },
    onError: (err) => {
      notifications.show({ message: err.message, color: 'red' });
    },
  });

  const handleSubmit = (values: PostFormValues) => {
    insertPost({ variables: values });
  };

  return (
    <>
      <Title order={2} mb="md">New Post</Title>
      <PostForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Draft" />
    </>
  );
}
