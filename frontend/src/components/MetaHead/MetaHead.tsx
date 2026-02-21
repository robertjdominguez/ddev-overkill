import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { usePageMeta } from './PageMetaProvider';

const SITE_URL = import.meta.env.VITE_SITE_URL ?? '';

export default function MetaHead() {
  const { title, description, image, url, type } = usePageMeta();

  const absoluteUrl = `${SITE_URL}${url}`;
  const absoluteImage = image
    ? image.startsWith('http') ? image : `${SITE_URL}${image}`
    : '';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="Rob Dominguez" />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
    </Helmet>
  );
}
