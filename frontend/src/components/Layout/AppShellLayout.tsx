import { AppShell, Burger, Affix, Group, Text, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import SideNav from './SideNav';

export default function AppShellLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <AppShell padding={{ base: 'md', sm: 'xl' }} footer={{ height: 60 }}>
      <Affix position={{ bottom: 60, right: 20 }}>
        <Burger opened={opened} onClick={toggle} size="md" aria-label="Open navigation" />
      </Affix>

      <SideNav opened={opened} onClose={close} />

      <AppShell.Main>
        <Container size="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {currentOutlet}
            </motion.div>
          </AnimatePresence>
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
