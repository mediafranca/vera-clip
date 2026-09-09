import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: ({ browser }) => ({
    name: 'Vera Clip',
    description: 'Captura selecciones y artículos legibles en Vera.',
    permissions: ['activeTab', 'contextMenus', 'storage'],
    host_permissions: ['http://127.0.0.1:4173/*'],
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
