import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/order/'],
      },
    ],
    sitemap: 'https://digital-kiff.vercel.app/sitemap.xml',
    host: 'https://digital-kiff.vercel.app',
  };
}
