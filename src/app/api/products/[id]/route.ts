import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  const storeId = process.env.PRINTFUL_STORE_ID;
  const { id } = await params;

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

    const response = await fetch(`https://api.printful.com/store/products/${id}`, {
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to fetch product' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
