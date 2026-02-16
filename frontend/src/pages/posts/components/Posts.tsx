import { Title, Text, Stack } from '@mantine/core';
import AllPosts from './AllPosts';

export default function Posts() {
  return (
    <Stack gap="md">
      <Title order={1}>
        Things I <Text span c="blue" inherit>write</Text>
      </Title>
      <Text c="dimmed">
        I work in engineering leadership and primarily focus on product and DX at
        PromptQL.
      </Text>
      <Text c="dimmed">
        Most of the posts you'll find talk about efforts made in automating
        mundane tasks, speeding up workflows, and learning new technologies.
        Hopefully something will spark an interest or help you with a small
        portion of a problem you're facing. Or, at the very least, entertain you.
      </Text>
      <Text c="dimmed">
        I spent nearly a decade in the classroom and working with some amazing
        educators. As such, there's a pretty large backlog of pedagogical and
        education-specific content.
      </Text>
      <AllPosts />
    </Stack>
  );
}
