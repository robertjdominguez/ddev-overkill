import { Stack, Text, Group, ActionIcon } from '@mantine/core';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import classes from './AuthorSidebar.module.css';

export default function AuthorSidebar() {
  return (
    <div className={classes.sidebar}>
      <Stack gap="md" align="start">
        <div className={classes.avatarWrapper}>
          <img src="/face.png" alt="Rob Dominguez" className={classes.avatar} />
        </div>
        <Text fw={700} size="lg">
          Rob Dominguez
        </Text>
        <Text size="sm" c="dimmed">
          Engineering manager solving problems at PromptQL. Former educator with a passion for
          automating the mundane.
        </Text>
        <Group gap="xs">
          <ActionIcon
            component="a"
            href="https://github.com/robertjdominguez"
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray"
            size="lg"
          >
            <FiGithub size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.linkedin.com/in/rob-dominguez-0b258b147/"
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray"
            size="lg"
          >
            <FiLinkedin size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://twitter.com/_RobDominguez"
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray"
            size="lg"
          >
            <FiTwitter size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </div>
  );
}
