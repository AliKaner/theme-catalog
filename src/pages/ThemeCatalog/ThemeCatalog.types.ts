// Theme types live in the publishable library now; re-export them here so the
// app's many existing imports keep working unchanged.
export type {
  ThemeColorConfig,
  ThemeConfig,
  ThemeVariant,
} from '../../lib/types';

export type ViewMode = 'jukebox' | 'grid';
