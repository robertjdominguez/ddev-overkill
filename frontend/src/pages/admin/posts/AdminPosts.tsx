import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Group, Title, ActionIcon, Loader, Alert, Badge } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { GET_ADMIN_POSTS, DELETE_POST } from '../data/queries';

export default function AdminPosts() {
  const { data, loading, error } = useQuery(GET_ADMIN_POSTS);
  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_ADMIN_POSTS }],
    onCompleted: () => notifications.show({ message: 'Post deleted', color: 'green' }),
  });

  const confirmDelete = (id: number, title: string) => {
    modals.openConfirmModal({
      title: 'Delete post',
      children: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePost({ variables: { id } }),
    });
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  const posts = data?.posts ?? [];

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Posts</Title>
        <Button component={Link} to="/admin/posts/new" leftSection={<FiPlus size={16} />}>
          New Post
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Slug</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th w={100}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {posts.map((post: any) => (
            <Table.Tr key={post.id}>
              <Table.Td>{post.title}</Table.Td>
              <Table.Td>{post.slug}</Table.Td>
              <Table.Td>
                <Badge color={post.isPublished ? 'green' : 'gray'} variant="filled" radius={'sm'} size="sm">
                  {post.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </Table.Td>
              <Table.Td>{new Date(post.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon component={Link} to={`/admin/posts/${post.id}/edit`} variant="subtle">
                    <FiEdit2 size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(post.id, post.title)}>
                    <FiTrash2 size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
