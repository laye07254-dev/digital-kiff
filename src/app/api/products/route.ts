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

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
