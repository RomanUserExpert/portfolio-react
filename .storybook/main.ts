import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)', '../components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes', 'storybook-addon-pseudo-states'],
  // project covers and slides referenced as /cases/... by lib/projects.ts
  staticDirs: ['../public'],
}

export default config
