import { Drawer, Stack, Group, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FiHome, FiFileText, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

interface SideNavProps {
  opened: boolean;
  onClose: () => void;
}

export default function SideNav({ opened, onClose }: SideNavProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
    >
      <Stack gap="md">
        <Anchor component={Link} to="/" onClick={onClose}>
          <Group gap="xs">
            <FiHome size={20} />
            Home
          </Group>
        </Anchor>
        <Anchor component={Link} to="/posts" onClick={onClose}>
          <Group gap="xs">
            <FiFileText size={20} />
            Posts
          </Group>
        </Anchor>
        {isAuthenticated && (
          <Anchor component={Link} to="/admin" onClick={onClose}>
            <Group gap="xs">
              <FiSettings size={20} />
              Admin
            </Group>
          </Anchor>
        )}
      </Stack>
    </Drawer>
  );
}
