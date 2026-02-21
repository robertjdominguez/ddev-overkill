import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink as MantineNavLink, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FiFileText, FiExternalLink, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/lib/auth';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={4}>Admin</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="xs" style={{ flex: 1 }}>
          <MantineNavLink
            component={NavLink}
            to="/admin/posts"
            label="Posts"
            leftSection={<FiFileText size={18} />}
            onClick={close}
          />
          <MantineNavLink
            component="a"
            href="/"
            target="_blank"
            label="View Site"
            leftSection={<FiExternalLink size={18} />}
          />
          <div style={{ flex: 1 }} />
          <MantineNavLink
            label="Logout"
            leftSection={<FiLogOut size={18} />}
            onClick={handleLogout}
          />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
