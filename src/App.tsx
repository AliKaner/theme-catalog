import { useState } from 'react';
import ThemeCatalog from './pages/ThemeCatalog';
import DocsPage from './pages/Docs/DocsPage';
import './i18n';

type Page = 'catalog' | 'docs';

const App = () => {
  const [page, setPage] = useState<Page>('catalog');

  if (page === 'docs') {
    return <DocsPage onBack={(): void => setPage('catalog')} />;
  }

  return <ThemeCatalog onOpenDocs={(): void => setPage('docs')} />;
};

export default App;
