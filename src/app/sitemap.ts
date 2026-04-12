
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nyayasahayak.in'
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cookie-policy',
    '/disclaimer',
    '/login',
    '/register',
    '/dashboard',
    '/dashboard/narrate',
    '/dashboard/document-intelligence',
    '/dashboard/document-generator',
    '/dashboard/bond-generator',
    '/dashboard/strength-analyzer',
    '/dashboard/court-assistant',
    '/dashboard/my-cases',
    '/dashboard/ngo-legal-aid',
    '/dashboard/learn',
    '/dashboard/police-guide',
    '/dashboard/research-analytics',
    '/dashboard/business-msme',
    '/dashboard/finances-billing',
    '/dashboard/support',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : route.startsWith('/dashboard') ? 0.9 : 0.7,
  }))
}
