import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: '../next.config.ts'
    }
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    // Ensure source maps are generated
    config.devtool = 'eval-source-map';
    
    // Fix import.meta and module compatibility issues
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    
    return config;
  },
  "staticDirs": [
    "../public"
  ],
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  }),
};
export default config;