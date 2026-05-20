export type ProjectSection = {
  label: string
  paragraphs?: string[]
  list?: string[]
}

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  slug: string
  title: string
  tags: string[]
  description: string
  cover: string
  metaDescription: string
  images: { src: string; alt: string }[]
  sections: ProjectSection[]
  links?: ProjectLink[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'insight',
    title: 'Insight',
    tags: ['AdTech', 'SaaS', 'Dashboard'],
    description:
      'Marketing attribution and analytics platform for e-commerce brands — multi-channel campaign data, performance tables, and role-based dashboards designed for clarity under data density.',
    cover: '/cases/insight/cover.jpg',
    metaDescription:
      'Insight — Marketing attribution and analytics platform for e-commerce brands. Multi-channel campaign data and role-based dashboards. Case study by Roman Ovcharenko.',
    featured: true,
    images: Array.from({ length: 9 }, (_, i) => ({
      src: `/cases/insight/img-0${i + 1}.jpg`,
      alt: `Insight — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'INSIGHT is a marketing attribution and performance analytics platform for e-commerce brands. The product handles real-time campaign data across multiple channels — complex performance tables, live metrics, multi-dimensional filters, and data visualizations that help merchants understand where their ad spend actually works.',
          'The design challenge was managing dense, fast-changing analytical data without overwhelming the user. The platform serves different roles — marketers, analysts, and operators — each needing a different level of depth from the same underlying data.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Running discovery — stakeholder alignment, user interviews, and competitive analysis to frame the design',
          'Synthesizing research into personas, journey maps, and role-based workflows',
          'Information architecture and user flows for multi-role navigation and data hierarchies',
          'Wireframing, prototyping, and usability testing — validating flows and iterating on feedback',
          'Designing data-heavy interfaces — dynamic tables, filters, chart views, and state indicators',
          'Building and maintaining a scalable component library with consistent states and tokens',
          'Dev handoff with clean Figma files — auto layout, components, tokens, all states',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'A clear, confident product interface that makes dense marketing data easy to read and act on. Complex attribution flows broken down into focused, navigable screens. A consistent design system that lets the team ship new features without re-solving solved problems, even as the data model grows in complexity.',
        ],
      },
    ],
  },
  {
    slug: 'teamadvance',
    title: 'TeamAdvance',
    tags: ['Social', 'B2C', 'Portal'],
    description:
      'Enterprise internal talent marketplace — employees discover projects, build career paths, find mentors, and earn rewards, with a scalable design system across light and dark themes.',
    cover: '/cases/TeamA/cover.png',
    metaDescription:
      'TeamAdvance — Enterprise internal talent marketplace and employee engagement platform. Case study by Roman Ovcharenko.',
    featured: true,
    images: Array.from({ length: 10 }, (_, i) => ({
      src: `/cases/TeamA/img-0${i + 1}.png`,
      alt: `TeamAdvance slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'TeamAdvance is an enterprise internal talent marketplace and employee engagement platform. It helps large organizations activate their workforce — employees discover internal projects, build career paths, find mentors, share ideas, and earn gamified rewards, while managers get visibility into team engagement and collaboration.',
          'The design challenge was unifying several heavy modules — projects, career paths, mentoring, crowdsourcing, and rewards — into a single coherent product, with role-based views for both employees and managers.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Running discovery — stakeholder alignment, user interviews, and competitive analysis',
          'Mapping roles, workflows, and jobs-to-be-done across employee and manager journeys',
          'Information architecture for a multi-module product with consistent navigation and patterns',
          'Designing complex flows — multi-step project creation, dynamic team assembly, career-path trees, and the gamified rewards system',
          'Wireframing, prototyping, and usability testing to validate and refine the heavier paths',
          'Shaping the visual language across light and dark themes and applying it consistently',
          'Building a scalable component library with tokens, states, and responsive behavior',
          'Dev handoff with clean Figma files — auto layout, components, tokens, all states',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'A cohesive platform where employees move naturally between projects, learning, mentoring, and rewards, and managers can read team signals at a glance. Dense enterprise workflows broken down into clear, role-aware screens — with a design system that scales as new modules are added.',
        ],
      },
    ],
  },
  {
    slug: 'ui-token-starter-pack',
    title: 'UI Token Starter Pack',
    tags: ['Design Tool', 'Vibe Code', 'Workflow Optimization'],
    description:
      'A Figma plugin that generates a complete, production-ready design token system in seconds — color primitives, semantic tokens, spacing, typography, radius, and elevation, all wired to Figma variables with Light and Dark mode out of the box.',
    cover: '/cases/Ui Token Starter Pack/Main image (1st).png',
    metaDescription:
      'UI Token Starter Pack — Figma plugin that generates a complete design token system in seconds. Color, spacing, typography, and more with Light/Dark mode. By Roman Ovcharenko.',
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/RomanUserExpert/figma-token-generator' },
      { label: 'Figma Community ↗', href: 'https://www.figma.com/community/plugin/1636308921845635089/ui-token-starter-pack' },
    ],
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `/cases/Ui Token Starter Pack/img-0${i + 1}.png`,
      alt: `UI Token Starter Pack — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'UI Token Starter Pack is a Figma plugin that generates a complete, production-ready design token system in seconds. Instead of manually creating hundreds of variables, the plugin outputs a structured set of color primitives and semantic tokens, spacing scales, typography variables and text styles, border radius, and elevation shadows — all wired to Figma variables with Light and Dark mode support out of the box.',
          'The design challenge was making something that feels fast and opinionated by default, but gives enough control for different types of projects — from a landing page to a full SaaS product. The plugin had to feel approachable for freelancers and small teams while producing a token architecture that holds up in real design systems.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Defining the full product scope and module structure: Colors, Spacing, Typography, Border Radius, Elevation',
          'Designing the plugin UI — sidebar navigation, progressive disclosure, preset-first settings to avoid overwhelming users with configuration',
          'Building the color system logic — shade scale generation using the Ant Design palette algorithm, with per-step hue rotation and saturation curves calibrated for both warm and cool palettes',
          'Designing and implementing semantic token architecture — Background, Surface, Text, Icon, Border, and Actions layers, all aliased to primitives with Light and Dark mode mappings',
          'Color validation UX — inline warnings for colors that are too light, too dark, or too pale, with a one-click Fix button that nudges values into a usable range',
          'Typography system — preset-based size scales (Compact / Standard / Large), multi-font support with category assignment, and automatic Figma text style generation',
          'Token Stylesheet — a visual preview page generated inside Figma on every run, showing color swatches, spacing bars, type table, radius cards, and elevation cards all bound to the live variables',
          'Handling Figma\'s free plan constraint — detecting whether multi-mode collections are supported and gracefully falling back to a separate Semantics Dark collection when they aren\'t',
          'Publishing to Figma Community — manifest setup, plugin ID, dynamic-page API migration',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'A self-contained design tool that compresses hours of token setup into a single click. Designers get a structured, multi-mode variable system in Figma that\'s ready for component building immediately — without needing to know how design tokens work under the hood. Built entirely through vibe coding: no prior plugin development experience, just design intuition, iteration, and AI-assisted coding.',
        ],
      },
    ],
  },
  {
    slug: 'yunona',
    title: 'Yunona',
    tags: ['E-commerce', 'Branding'],
    description:
      'Multi-category consumer e-commerce storefront — from merchandising and catalog browsing to multi-step checkout, fully responsive across desktop and mobile.',
    cover: '/cases/yunona/cover.png',
    metaDescription:
      'Yunona — Multi-category consumer e-commerce storefront. Full shopper experience from catalog browsing to checkout, desktop and mobile. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 8 }, (_, i) => ({
      src: `/cases/yunona/img-0${i + 1}.png`,
      alt: `Yunona slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'Yunona is a multi-category consumer e-commerce storefront — a full shopper-facing experience covering electronics, cosmetics, sports, travel, and more. The product includes the home page with merchandising surfaces, catalog browsing, product detail pages, cart and checkout, account flows, and profile with order history.',
          'The design challenge was balancing a rich merchandising experience (banners, deals, featured products, multi-level categories) with clear, frictionless conversion flows — across both desktop and mobile — while keeping the visual language calm and easy to scan.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Running discovery — competitor analysis of e-commerce patterns and understanding shopper behaviors',
          'Mapping shopping journeys — from discovery and browsing to checkout, account creation, and post-purchase',
          'Information architecture — multi-level navigation, category structure, and filter/sort logic',
          'Designing core flows — catalog, product detail, cart, multi-step checkout (guest and logged-in), account and reset-password',
          'Full responsive coverage — every flow designed in parity for desktop and mobile, including mobile-specific side menus, filter and sort sheets',
          'Shaping the visual language and applying it consistently across merchandising, product, and account surfaces',
          'Building a scalable component library with tokens, states, and responsive variants',
          'Dev handoff with clean Figma files — auto layout, components, tokens, all states',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'A clean, responsive e-commerce experience that makes browsing easy and checkout fast. A consistent design language across merchandising, catalog, and account flows — giving the team a foundation to launch new categories, promotions, and checkout variations without rebuilding core patterns.',
        ],
      },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
