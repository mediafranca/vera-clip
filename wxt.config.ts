import { defineConfig } from 'wxt';

export default defineConfig({
  outDir: 'dist',
  zip: {
    artifactTemplate: '{{name}}-{{browser}}.zip',
    sourcesTemplate: '{{name}}-sources.zip',
  },
  manifest: ({ browser }) => ({
    name: 'Vera Clip',
    description: 'Captura selecciones y artículos legibles en Vera.',
    permissions: ['activeTab', 'contextMenus', 'storage'],
    host_permissions: [
      'http://127.0.0.1:4173/*',
      'http://localhost/*',
      'https://conecta.mediafranca.net/*',
    ],
    action: {
      default_title: 'Capturar en Vera',
      default_icon: {
        16: 'icon-16.png',
        32: 'icon-32.png',
        48: 'icon-48.png',
        96: 'icon-96.png',
        128: 'icon-128.png',
      },
    },
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      96: 'icon-96.png',
      128: 'icon-128.png',
    },
    ...(browser === 'firefox' ? {
      browser_specific_settings: {
        gecko: {
          id: 'clip@vera.mediafranca.net',
          data_collection_permissions: {
            required: ['websiteContent', 'websiteActivity'],
          },
        },
      },
    } : {}),
  }),
});
