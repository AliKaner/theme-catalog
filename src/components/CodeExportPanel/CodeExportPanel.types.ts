import type { ThemeConfig } from '../../pages/ThemeCatalog/ThemeCatalog.types';

export type CodeExportPanelProps = {
  theme: ThemeConfig;
};

// A single editor tab describing one exportable file for the active theme.
export type ExportTab = {
  id: string;
  filename: string;
  language: string;
  // Color of the little file-type dot shown in the tab, VSCode style.
  dotColor: string;
  // The full code content that gets copied to the clipboard.
  content: string;
  // Where the file belongs in a project, shown in the breadcrumb strip.
  path?: string;
};

// A target framework/technology the export can be tailored to.
export type ExportTech =
  | 'css'
  | 'scss'
  | 'tailwind'
  | 'nextjs'
  | 'nuxtjs'
  | 'json';
