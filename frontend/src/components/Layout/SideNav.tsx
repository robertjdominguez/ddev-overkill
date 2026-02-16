import { Drawer, Stack, Group, Anchor, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FiHome, FiFileText, FiSun, FiMoon } from 'react-icons/fi';

interface SideNavProps {
  opened: boolean;
  onClose: () => void;
}

export default function SideNav({ opened, onClose }: SideNavProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
        <ActionIcon
          variant="subtle"
          onClick={toggleColorScheme}
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </ActionIcon>
      </Stack>
    </Drawer>
  );
}
