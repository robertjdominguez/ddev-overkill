import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useGetPostBySlugQuery } from '@/generated/graphql';

const container = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function Post() {
  const { slug } = useParams();
  const { data, loading, error } = useGetPostBySlugQuery({
    variables: { slug: slug! },
    skip: !slug,
  });

  const post = data?.posts[0];

  return (
    <motion.div variants={container} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)' }}>
      <motion.div variants={item}>
        {loading && <p>Loading…</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && !post && <p>Post not found</p>}
      </motion.div>
      <motion.div variants={item} style={{ color: 'var(--mantine-color-dimmed)', fontSize: '14px' }}>
        {post?.createdAt && new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </motion.div>
      <motion.div variants={item} data-color-mode="dark">
        {post?.body && (
          <MDEditor.Markdown
            source={post.body}
            rehypePlugins={[[rehypeSanitize]]}
            style={{
              background: 'none',
              font: 'inherit',
              fontFamily: 'inherit',
              fontSize: '15px',
              color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-3))',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
