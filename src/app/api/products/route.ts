import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  const storeId = process.env.PRINTFUL_STORE_ID;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
    };
    if (storeId) {
      headers['X-PF-Store-Id'] = storeId;
    }

    const response = await fetch('https://api.printful.com/store/products', {
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to fetch products' }, { status: response.status });
    }

    // Use the catalog product image (clean mockup without placeholder design)
    // by fetching the variant's catalog product image instead of the preview
    const products = data.result || [];

    const detailedProducts = await Promise.all(
      products.map(async (p: any) => {
        try {
          const detailRes = await fetch(`https://api.printful.com/store/products/${p.id}`, {
            headers,
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            const variants = detailData.result?.sync_variants || [];
            if (variants.length > 0) {
              const firstVariant = variants[0];
              // Use the catalog product image (clean, no design overlay)
              if (firstVariant.product?.image) {
                return { ...p, thumbnail_url: firstVariant.product.image };
              }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch details for product ${p.id}`, e);
        }
        // Fallback to the basic thumbnail
        return p;
      })
    );

    return NextResponse.json({
      code: 200,
      result: detailedProducts
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
