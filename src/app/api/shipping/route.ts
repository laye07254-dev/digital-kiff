import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  const storeId = process.env.PRINTFUL_STORE_ID;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { recipient, items } = body;

    if (!recipient || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing address or items' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    if (storeId) {
      headers['X-PF-Store-Id'] = storeId;
    }

    // Call Printful Shipping Rates API
    const response = await fetch('https://api.printful.com/shipping/rates', {
      method: 'POST',
      headers,
      body: JSON.stringify({ recipient, items }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to calculate shipping' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
