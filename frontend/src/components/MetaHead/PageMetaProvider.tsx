import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Rob Dominguez';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/posts': 'Posts',
};

function titleFromPathname(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.startsWith('/posts/')) return 'Post';
  return 'Page';
}

interface PageMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

interface PageMetaContextValue extends PageMeta {
  setPageMeta: (meta: Partial<Omit<PageMeta, 'url'>>) => void;
}

const PageMetaContext = createContext<PageMetaContextValue | null>(null);

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const metaSetRef = useRef<string | null>(null);

  const defaultTitle = `${titleFromPathname(location.pathname)} | ${SITE_NAME}`;

  const [meta, setMeta] = useState<PageMeta>({
    title: defaultTitle,
    description: 'Rob Dominguez — software engineer, writer, and tinkerer.',
    image: '',
    url: location.pathname,
    type: 'website',
  });

  // Reset to defaults on route change
  useEffect(() => {
    metaSetRef.current = null;
    setMeta({
      title: `${titleFromPathname(location.pathname)} | ${SITE_NAME}`,
      description: 'Rob Dominguez — software engineer, writer, and tinkerer.',
      image: '',
      url: location.pathname,
      type: 'website',
    });
  }, [location.pathname]);

  const setPageMeta = useCallback(
    (overrides: Partial<Omit<PageMeta, 'url'>>) => {
      metaSetRef.current = location.pathname;
      setMeta(prev => {
        const title = overrides.title ? `${overrides.title} | ${SITE_NAME}` : prev.title;
        return { ...prev, ...overrides, title };
      });
    },
    [location.pathname],
  );

  return (
    <PageMetaContext.Provider value={{ ...meta, setPageMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
}

export function usePageMeta() {
  const ctx = useContext(PageMetaContext);
  if (!ctx) throw new Error('usePageMeta must be used within PageMetaProvider');
  return ctx;
}
