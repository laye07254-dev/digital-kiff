import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digital-kiff.vercel.app';

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Pages produits dynamiques depuis Printful
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const products = data.products || [];
      productPages = products.map((product: { id: string | number }) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // En cas d'erreur, on retourne juste les pages statiques
  }

  return [...staticPages, ...productPages];
}
