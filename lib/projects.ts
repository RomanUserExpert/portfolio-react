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
    slug: 'risklayer',
    title: 'RiskLayer',
    tags: ['Fintech', 'Enterprise SaaS', 'Interaction Design'],
    description:
      'Multi-module B2B platform for CROs, Compliance Officers, and Risk Analysts — six distinct workflows covering risk monitoring, stress testing, compliance rule management, exposure tracking, and regulatory audit, unified under a single coherent system.',
    cover: '/cases/RiskLayer/cover.png',
    metaDescription:
      'RiskLayer — Enterprise risk and compliance platform for financial institutions. Six-module B2B product designed for CROs, Compliance Officers, and Risk Analysts. Case study by Roman Ovcharenko.',
    featured: true,
    images: [
      ...Array.from({ length: 5 }, (_, i) => ({
        src: `/cases/RiskLayer/${i + 1}.png`,
        alt: `RiskLayer — slide ${i + 1}`,
      })),
      { src: '/cases/RiskLayer/6v2.png', alt: 'RiskLayer — slide 6' },
      { src: '/cases/RiskLayer/7.png', alt: 'RiskLayer — slide 7' },
    ],
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'RiskLayer is a multi-module B2B platform for CROs, Compliance Officers, and Risk Analysts working in fintech and institutional finance. The product spans risk monitoring, stress testing, compliance rule management, exposure tracking, and regulatory audit — six distinct workflows with fundamentally different user goals and information needs. The core design challenge was creating a coherent system across these modules without sacrificing the data density each role requires.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Competitive Analysis & Domain Research — mapped the landscape across Moody\'s RiskIntegrity, AuditBoard, SAS Viya Risk, and SS&C Algorithmics, identifying a consistent gap between analytical depth and navigability',
          'Information Architecture & Role-Based Navigation — resolved the tension between a shared navigation shell and role-specific workflows, resulting in a two-group sidebar structure (Monitor / Manage) derived from how CROs and Compliance Officers move through the product differently',
          'Designing for Data Density and Progressive Disclosure — managed information hierarchy across six data-heavy screens: a 5×5 risk matrix with drill-down, a shock parameter table with override states, a compliance condition builder with nested logic, each requiring its own disclosure strategy',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'RiskLayer demonstrates a complete enterprise risk platform designed for three distinct professional roles operating under regulatory pressure. Risk managers get an actionable dashboard with drill-down capability. Compliance officers get a no-code rule builder with human-readable logic preview. Analysts get a stress testing environment with scenario comparison and delta analysis. The system holds together visually and structurally across six screens that could otherwise fragment into six unrelated tools.',
        ],
      },
    ],
  },
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
    featured: true,
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
    slug: 'vaultex',
    title: 'Vaultex',
    tags: ['Fintech', 'Trading', 'Dashboard'],
    description:
      'Professional trading platform for active traders and portfolio managers across equities, crypto, forex, and commodities — information-dense interfaces designed for speed, clarity, and a continuous multi-screen trading workflow.',
    cover: '/cases/Vaultex/Main image (1st).png',
    metaDescription:
      'Vaultex — Professional trading and portfolio management platform. Dense financial data interfaces designed for speed and clarity across four asset classes. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 8 }, (_, i) => ({
      src: `/cases/Vaultex/${i + 1}.png`,
      alt: `Vaultex — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'Vaultex is a professional trading platform for active traders and portfolio managers operating across equities, crypto, forex, and commodities. The design challenge was building a product where information density is a requirement rather than a problem to eliminate — time-sensitive decisions, four asset classes, and multiple workflows that needed to function as one coherent system.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Competitive analysis and domain research — audited professional trading platforms to understand where data density serves experienced users and where it becomes noise, establishing the core design principle: high information density is acceptable, ambiguity under time pressure is not',
          'Information architecture and user flows — structured the product around the natural sequence of a trader\'s workflow: monitor, manage, execute, assess risk, audit, research, with each stage mapped to a dedicated screen with a single primary job',
          'Interface design and iteration — ran exploratory cycles across layout, typographic hierarchy, spatial grouping, and semantic color to separate status signals from numerical data, validating against a single test: can a trader extract a meaningful signal in under two seconds',
          'Design system and component architecture — built a component library supporting four asset classes, multiple data states, and real-time visual feedback, with semantic color tokens, consistent number formatting, and a shared status language across all contexts',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'A trading platform where the full workflow — from portfolio monitoring to order execution to risk assessment — runs as a continuous, context-preserving flow rather than a set of disconnected screens. Dense financial data reads at a glance rather than requiring interpretation. The design system provides a stable foundation that absorbs product growth without re-solving foundational layout and pattern decisions.',
        ],
      },
    ],
  },
  {
    slug: 'archon',
    title: 'Archon',
    tags: ['Fintech', 'SaaS', 'Data Density'],
    description:
      'Enterprise record search and management platform for revenue and operations teams — compound filter logic, high-density results tables, bulk operations, and export flows built for datasets too large for a standard CRM.',
    cover: '/cases/Archon/cover.png',
    metaDescription:
      'Archon — Enterprise record search and management platform for fintech B2B teams. Compound filtering, bulk operations, and export flows for large-scale datasets. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `/cases/Archon/${i + 1}.png`,
      alt: `Archon — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'Archon is a record search and management platform for revenue and operations teams handling large account and contract datasets — built for the moment a CRM\'s basic search stops being enough. The core challenge was compound filtering: letting non-technical users build AND/OR query logic across dozens of fields without ever seeing the word "query." Every downstream screen had to stay usable at scale, from a single record to a 124,000-row dataset.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Heuristic Evaluation — audited filter builders in Salesforce, Airtable, and Retool to identify where compound logic UX breaks down; research shaped the decision to color-code AND and OR groups distinctly rather than relying on text labels alone',
          'Information Architecture — mapped the record lifecycle (search, inspect, act, export) to determine screen sequence and what belonged in a side panel versus a dedicated page; export became a full wizard once it was clear scheduling and column selection couldn\'t compress into an overlay',
          'Designing for Data Density — solved the results table challenge with progressive disclosure: a record detail panel holds risk scoring and contact context off the main grid, keeping the table lean and scannable at 124,000-row scale',
          'State and Edge Case Design — bulk operations handle partial failure gracefully; the status-change flow detects record-level conflicts and recalculates the affected count live so users always see an honest number before committing',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'Archon gives operations teams a way to interrogate large datasets with the same logical precision as a database query, without writing one. Saved filters turn one-off investigations into reusable team assets, and conflict-aware bulk actions mean status changes and exports no longer require a "let me check if anyone else is editing this" Slack message first. Six screens that share one data model, one visual language, and one underlying philosophy: reveal complexity gradually rather than all at once.',
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
  {
    slug: 'prism-bi',
    title: 'Prism BI',
    tags: ['Fintech', 'Self-serve BI', 'Design System'],
    description:
      'Self-serve analytics builder for payments teams — making the full path from raw data to a trusted, shareable report feel like one coherent system instead of a loose collection of admin tools bolted together over time.',
    cover: '/cases/Prism BI/cover.png',
    metaDescription:
      'Prism BI — Self-serve analytics builder for payments teams. Edit/view duality, row-level access control, and end-to-end dashboard governance. Case study by Roman Ovcharenko.',
    featured: true,
    images: Array.from({ length: 7 }, (_, i) => ({
      src: `/cases/Prism BI/${i + 2}.png`,
      alt: `Prism BI — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'Prism BI lets analysts and finance leads at a payments company build, schedule, and govern their own dashboards without filing a ticket with data engineering. The challenge wasn\'t any single interaction — it was making the full path from raw data to a trusted, shareable report feel like one coherent system instead of a loose collection of admin tools bolted together over time.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Stakeholder interviews & analytics review — early conversations with an analytics lead and finance stakeholders surfaced the real failure mode: people weren\'t struggling to read dashboards, they were waiting on engineering for new ones; that reframed the brief from "design a dashboard" to "design a builder," shaping every downstream decision',
          'Information architecture — edit vs. view duality: the key structural call was treating editing and consuming as two separate problems rather than one screen with a mode toggle; builders needed room to manipulate layout and data mappings, consumers needed a clean surface for reading numbers and drilling into the records behind them; resolving that early prevented a messy hybrid screen trying to serve both audiences at once',
          'Role-based access modeling — row-level permissions needed compound logic (a regional team seeing only its rows, sometimes across an OR condition spanning two regions) without turning the screen into a raw query builder; reusing a compound-rule pattern from elsewhere in the portfolio kept the model consistent across projects',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'What started as "build a dashboard" became a self-serve analytics platform where editing, consumption, and governance are each treated as distinct, intentional surfaces rather than one overloaded screen. An analyst can go from connecting a source to a scheduled, access-controlled report without writing a support ticket. The row-level access model and the edit/view split are reusable patterns the team can extend as new dashboards get added.',
        ],
      },
    ],
  },
  {
    slug: 'nexuscrm',
    title: 'NexusCRM',
    tags: ['Sales Ops', 'Enterprise SaaS', 'Workflow Automation'],
    description:
      'Sales operations platform for mid-market B2B teams — pipeline, outreach, and forecasting unified under one locked dataset, so a weighted pipeline number means the same thing on the board and in the quarterly forecast.',
    cover: '/cases/NexusCRM/cover.png',
    metaDescription:
      'NexusCRM — Sales operations platform for mid-market B2B teams unifying pipeline, outreach, and forecasting. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `/cases/NexusCRM/${i + 1}.png`,
      alt: `NexusCRM — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'NexusCRM is a sales operations platform for mid-market B2B teams running pipeline, outreach, and forecasting through one system instead of three disconnected tools. The core challenge wasn\'t any individual screen — it was keeping six interconnected modules honest against each other, so a weighted pipeline number means the same thing whether a rep is scanning the board or a director is closing the quarterly forecast.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Competitive Benchmarking — mapped how Pipedrive, HubSpot, and Outreach/Salesloft handle kanban-to-table switching, deal-rot signaling, and cadence branching, then made deliberate departures where convention didn\'t fit an enterprise context, rather than defaulting to a prior project\'s pattern',
          'Cross-Module Data Architecture — every figure traces back to one locked dataset; weighted pipeline value, quota attainment, and forecast variance are calculated once and referenced everywhere downstream, so a rep\'s pipeline review and a manager\'s forecast rollup never quietly disagree',
          'Workflow Automation Design — the email sequence builder needed to demonstrate real sales-ops sophistication, not a mail-merge queue with a visual skin; designed branching logic — an open/no-open condition that splits a cadence into two paths and reconverges before a final send — as structural proof this is automation, not a linear list',
          'Design System & Theming — built a token architecture where brand color is strictly decoupled from semantic status colors and chart palettes, so the product supports dark and light themes without any color carrying two conflicting meanings',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'NexusCRM gives sales teams one system to trust instead of several spreadsheets to reconcile by hand. Reps get a pipeline dense enough for daily triage without losing legibility; managers get a forecast built from the same numbers reps already see, not a separate estimate assembled after the fact. The integration layer — with explicit field-type conflict resolution rather than a silent best-guess — signals a platform built to sit inside a company\'s existing stack, not replace it overnight.',
        ],
      },
    ],
  },
  {
    slug: 'clinova',
    title: 'Clinova',
    tags: ['HealthTech', 'EDC Platform', 'Design System'],
    description:
      'Electronic data capture platform for Phase II–III clinical trials — built for the tension between fast daily site work and a regulated audit posture where every value change is signed, reasoned, and traceable.',
    cover: '/cases/Clinova/cover.png',
    metaDescription:
      'Clinova — Electronic data capture (EDC) platform for clinical trials. Regulated workflows, audit trails, and data-density design for clinical data managers. Case study by Roman Ovcharenko.',
    images: [
      ...Array.from({ length: 7 }, (_, i) => ({
        src: `/cases/Clinova/${String(i + 1).padStart(2, '0')}.png`,
        alt: `Clinova — slide ${i + 1}`,
      })),
      { src: '/cases/Clinova/08-new.png', alt: 'Clinova — slide 8' },
    ],
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'Clinova is an EDC system for running Phase II–III clinical trials: the software clinical data managers and monitors use to capture, verify, and lock trial data across multiple sites. The design problem sits in the tension the domain is built on — the platform has to move fast enough for daily site work while holding a regulated audit posture where every value change is signed, reasoned, and traceable. Getting that balance wrong in either direction breaks the product.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Domain framing & research — pinned down what the product actually was, since "clinical data management" is easy to confuse with electronic health records despite the two having opposite mental models; benchmarked against the category\'s reference systems and reframed the work around EDC and 21 CFR Part 11 before any layout decisions, a framing that cascaded through every screen that followed',
          'Information architecture — trial data is deeply nested (study, site, subject, visit, form, field), so the navigation had to make that hierarchy walkable without burying the one thing a monitor is hunting for: where the data isn\'t clean yet; structured the product around a dual-level model that keeps study-wide context available while letting a user drop straight into a single discrepancy',
          'Interaction design for regulated states — mapped the full lifecycle of a discrepancy (automatic edit checks, query generation, response, resolution) and designed the form states, audit trail, and electronic signature moments so compliance reads as a first-class part of the interface rather than a layer bolted on top',
          'Design system & data-density work — built the token architecture with a hard rule separating brand color from clinical status, so the reds and ambers a reviewer relies on never compete with interface accent; dense matrices, longitudinal lab views, and permission grids all draw from the same system',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'Clinova became a tool that lets a monitor open any study and immediately see which subjects need attention, trace a single out-of-range lab result from the chart where it surfaced through the query it raised to the overdue follow-up it triggered, and understand exactly who is permitted to resolve it. The regulated behavior — signatures, reasons, audit history — is woven through the daily workflow instead of sitting apart from it, which is the difference between a system people trust with trial data and one they work around.',
        ],
      },
    ],
  },
  {
    slug: 'pulseops',
    title: 'PulseOps',
    tags: ['DevOps', 'SaaS', 'Real-Time Monitoring'],
    description:
      'Infrastructure monitoring and incident response for DevOps teams — health, alerting, logs, incidents, deployments, and on-call coverage unified into one operational record instead of a set of disconnected tools bolted together.',
    cover: '/cases/PulseOps/cover.png',
    metaDescription:
      'PulseOps — Infrastructure monitoring and incident response platform for DevOps teams. Health, alerting, incidents, deployments, and on-call coverage as one connected system. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 7 }, (_, i) => ({
      src: `/cases/PulseOps/${String(i + 1).padStart(2, '0')}.png`,
      alt: `PulseOps — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'PulseOps helps on-call engineers monitor infrastructure health, configure alerting, and resolve incidents across a multi-cluster environment. The core challenge wasn\'t visual complexity — it was making health, alerting, logs, incidents, deployments, and on-call coverage behave like one operational record instead of a set of disconnected tools bolted together.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Competitive Analysis & Benchmarking — benchmarked Datadog, Grafana, and PagerDuty to understand where their information architectures converge by convention versus by necessity, which informed treating dark mode as a functional choice for extended monitoring sessions and avoiding an interaction pattern already used elsewhere in this portfolio',
          'Entity Modeling & Information Architecture — the highest-risk decision was locking a Cluster → Service → Instance model before any screen work began, then mapping explicit relationships across the product (which alert triggered which incident, which deployment is a suspected cause, who\'s currently responding); that single decision is what lets the product read as one connected system rather than a collection of disconnected views',
          'Designing for Data Density & Progressive Disclosure — with 21 service instances across four environments, I used layered disclosure throughout: aggregated rows that expand into per-cluster detail, a persistent incident panel that stays visible even in a healthy state, and a log stream built around a live/paused distinction so engineers can freeze context without losing the feed',
          'State & Escalation Design — designed explicit coverage-gap visualization into the rotation calendar, a multi-step escalation path from chat to phone to SMS, and a rollback flow that requires confirmation before an irreversible action — each traceable to a real incident scenario the product needed to explain',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'The result is a product where a coverage gap visibly explains an unanswered incident, where a deployment\'s config change can be the answer to a regression three screens away, and where an engineer can move from alert to root cause to resolution without losing the thread — a reusable pattern for cross-screen consistency that\'s easy to promise and difficult to actually design.',
        ],
      },
    ],
  },
  {
    slug: 'datamind',
    title: 'DataMind',
    tags: ['AI / LLMOps', 'B2B SaaS', 'Data-Dense Interfaces'],
    description:
      'Observability and evaluation platform for teams running LLM applications in production — catching quality regressions that a rising average metric can quietly hide.',
    cover: '/cases/Datamind/cover.png',
    metaDescription:
      'DataMind — Observability and evaluation platform for teams running LLM applications in production. Case study by Roman Ovcharenko.',
    images: Array.from({ length: 7 }, (_, i) => ({
      src: `/cases/Datamind/${String(i + 1).padStart(2, '0')}.png`,
      alt: `DataMind — slide ${i + 1}`,
    })),
    sections: [
      {
        label: 'About Project',
        paragraphs: [
          'DataMind is an observability and evaluation platform for teams running LLM applications in production. Teams shipping LLM features operate without the instrumentation they\'d demand anywhere else in their stack — a prompt change can lift average quality while quietly wrecking one narrow class of user question, and nobody notices until support tickets accumulate. DataMind exists for the engineers who have to catch that, which made the hard part of this project credibility rather than density: the people who\'d judge the interface write evaluation harnesses for a living and spot a wrong abstraction in about five seconds.',
        ],
      },
      {
        label: 'My Role & Activities',
        list: [
          'Competitive analysis and domain research — worked through LangSmith, Langfuse, Braintrust, Arize Phoenix, and Weights & Biases Weave to understand how practitioners actually reason about model quality; the category turned out to contain three distinct products that get conflated (observability, data labeling, visual app building), so scope was cut back to observability and evaluation only',
          'Canonical dataset before layout — built a fictional production incident with full internal consistency, then validated every figure with Python scripts before touching a single screen: weighted segment averages, token costs derived from real model pricing, timing that actually sums',
          'Designing for diagnostic reasoning — the central design problem was making a regression visible when the headline metric had improved, which required deciding what earns visual weight and what gets deliberately demoted, then threading one causal chain across the whole product so a viewer could follow the incident from symptom to root cause without reading documentation',
          'Semantic colour architecture — built a token system where the brand accent belongs exclusively to actions, status colours never touch anything else, and one warning tone appears in exactly one place across the entire product',
        ],
      },
      {
        label: 'Outcome',
        paragraphs: [
          'The product holds together as a single system rather than a collection of adjacent views. Every figure resolves to one validated source, which means an engineer can trace a production failure through prompt history, regression testing, human review, and budget impact without hitting a number that contradicts the previous screen. The design decisions that mattered most were subtractive: cutting scope that belonged to a different product category, and refusing to let a rising average metric look like unambiguous good news.',
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
