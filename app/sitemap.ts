import type { MetadataRoute } from 'next';
import { projectsData } from '@/lib/projects-data';
import { siteMetadata } from '@/lib/site-content';

export const dynamic = 'force-static';

const lastModified = new Date('2026-05-23');

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = projectsData.map((project) => ({
    url: `${siteMetadata.url}/projects/${project.id}/`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${siteMetadata.url}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    ...projectUrls,
  ];
}
