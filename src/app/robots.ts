import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/management-console', 
        '/dashboard/advocate-verification',
        '/create-profile'
      ],
    },
    sitemap: 'https://nyayasahayak.in/sitemap.xml',
  }
}
