import type { Preview } from '@storybook/nextjs-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { Inter, Special_Gothic_Expanded_One } from 'next/font/google'
import '../styles/globals.css'

// Same fonts as app/layout.tsx: they expose --font-inter / --font-special-gothic, which tokens.css builds on.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const specialGothic = Special_Gothic_Expanded_One({ subsets: ['latin'], weight: '400', variable: '--font-special-gothic', display: 'swap' })

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true }, // the page background comes from --color-bg-default
    a11y: { test: 'todo' },
    options: { storySort: { order: ['Foundations', 'UI', 'Project', 'Layout', 'Sections', 'Pages'] } },
  },
  decorators: [
    // html[data-theme] switches tokens.css between light and dark, exactly like the site's toggle
    withThemeByDataAttribute({ themes: { light: 'light', dark: 'dark' }, defaultTheme: 'light', attributeName: 'data-theme', parentSelector: 'html' }),
    (Story) => {
      if (typeof document !== 'undefined') document.documentElement.classList.add(inter.variable, specialGothic.variable)
      return <Story />
    },
  ],
}

export default preview
