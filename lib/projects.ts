export type ProjectSection = {
  label: string
  paragraphs?: string[]
  list?: string[]
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
