import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Title, Loader, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import PostForm, { type PostFormValues } from './components/PostForm';
import { GET_POST_FOR_EDIT, UPDATE_POST, PUBLISH_POST, UNPUBLISH_POST } from '../data/queries';

export default function AdminPostEdit() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id!, 10);

  const { data, loading: queryLoading, error } = useQuery(GET_POST_FOR_EDIT, {
    variables: { id: postId },
  });

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      notifications.show({ message: 'Post saved', color: 'green' });
    },
    onError: (err) => {
      notifications.show({ message: err.message, color: 'red' });
    },
  });

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

  if (queryLoading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  const post = data?.posts_by_pk;
  if (!post) return <Alert color="red">Post not found</Alert>;

  const mutationLoading = updateLoading || publishLoading || unpublishLoading;

  const handleSubmit = (values: PostFormValues) => {
    updatePost({ variables: { id: postId, ...values } });
  };

  const handlePublish = (values: PostFormValues) => {
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

  return (
    <>
      <Title order={2} mb="md">Edit Post</Title>
      <PostForm
        initialValues={{
          slug: post.slug,
          title: post.title,
          hook: post.hook ?? '',
          body: post.body ?? '',
          image: post.image ?? '',
        }}
        onSubmit={handleSubmit}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        isPublished={post.isPublished}
        firstPublished={post.firstPublished}
        loading={mutationLoading}
        submitLabel={post.isPublished ? 'Save' : 'Save Draft'}
      />
    </>
  );
}
