import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'

const baseUrl = 'https://roman-ovcharenko.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/cv`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...projectUrls,
  ]
}
