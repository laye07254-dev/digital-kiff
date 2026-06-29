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

    const products = data.result || [];

    const detailedProducts = await Promise.all(
      products.map(async (p: any) => {
        // Detect if this product has a real custom design preview:
        // Products with real designs have a thumbnail starting with /files/
        // Products we created with a placeholder have /o/upload/product-catalog-img/
        const hasRealDesign = p.thumbnail_url && 
          !p.thumbnail_url.includes('/o/upload/product-catalog-img/');

        try {
          const detailRes = await fetch(`https://api.printful.com/store/products/${p.id}`, {
            headers,
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            const variants = detailData.result?.sync_variants || [];
            if (variants.length > 0) {
              const firstVariant = variants[0];

              if (hasRealDesign) {
                // Use the preview mockup image (shows the real design)
                const previewFile = firstVariant.files?.find((f: any) => f.type === 'preview');
                if (previewFile?.preview_url) {
                  return { ...p, thumbnail_url: previewFile.preview_url };
                }
              }

              // For placeholder-design products: use clean catalog image
              if (firstVariant.product?.image) {
                return { ...p, thumbnail_url: firstVariant.product.image };
              }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch details for product ${p.id}`, e);
        }

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
