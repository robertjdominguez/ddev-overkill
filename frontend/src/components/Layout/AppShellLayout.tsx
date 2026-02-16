import { AppShell, Burger, Affix, Group, Text, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';

export default function AppShellLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell padding={{ base: 'md', sm: 'xl' }} footer={{ height: 60 }}>
      <Affix position={{ bottom: 60, right: 20 }}>
        <Burger opened={opened} onClick={toggle} size="md" aria-label="Open navigation" />
      </Affix>

      <SideNav opened={opened} onClose={close} />

      <AppShell.Main>
        <Container size="sm">
          <Outlet />
        </Container>
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Group justify="center">
          <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} Rob Dominguez</Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
