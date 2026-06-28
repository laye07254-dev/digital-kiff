import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  const storeId = process.env.PRINTFUL_STORE_ID;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { recipient, items, shipping, payment_id } = body;

    if (!recipient || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    if (storeId) {
      headers['X-PF-Store-Id'] = storeId;
    }

    // Format order payload for Printful
    const orderPayload = {
      recipient: {
        name: recipient.name,
        address1: recipient.address1,
        city: recipient.city,
        country_code: recipient.country_code,
        zip: recipient.zip,
      },
      items: items.map((item: any) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      external_id: payment_id || `order_${Date.now()}`
    };

    // Create Draft Order in Printful
    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to create order on Printful' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
