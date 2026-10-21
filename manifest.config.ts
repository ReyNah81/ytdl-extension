import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'YT Downloader',
  version: '0.1.0',
  description: 'Download videos you have the right to save.',
  permissions: ['downloads', 'activeTab', 'storage'],
  host_permissions: ['*://*.youtube.com/*'],
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  content_scripts: [
    { matches: ['*://*.youtube.com/*'], js: ['src/content/index.ts'], run_at: 'document_idle' },
  ],
  action: { default_popup: 'src/popup/index.html' },
  options_page: 'src/options/index.html',
})
