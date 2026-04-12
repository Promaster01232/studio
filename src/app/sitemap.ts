
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nyayasahayak.in'
  
  // Public Routes
  const publicRoutes = [
    '',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cookie-policy',
    '/disclaimer',
    '/login',
    '/register',
    '/blog',
  ];

  // AI Tool Routes (Dashboard)
  const toolRoutes = [
    '/dashboard',
    '/dashboard/narrate',
    '/dashboard/document-intelligence',
    '/dashboard/document-generator',
    '/dashboard/bond-generator',
    '/dashboard/strength-analyzer',
    '/dashboard/court-assistant',
    '/dashboard/evidence-audit',
    '/dashboard/bail-estimator',
    '/dashboard/statutory-linker',
    '/dashboard/contract-auditor',
  ];

  // Resource Routes
  const resourceRoutes = [
    '/dashboard/my-cases',
    '/dashboard/ngo-legal-aid',
    '/dashboard/learn',
    '/dashboard/police-guide',
    '/dashboard/research-analytics',
    '/dashboard/business-msme',
    '/dashboard/finances-billing',
    '/dashboard/support',
  ];

  const allRoutes = [...publicRoutes, ...toolRoutes, ...resourceRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/dashboard') ? 0.8 : 0.6,
  }))
}
