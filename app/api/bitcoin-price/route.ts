import { NextRequest, NextResponse } from 'next/server';

// In-memory cache to avoid redundant API calls
const priceCache = new Map<string, { usd: number; eur: number }>();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // YYYY-MM-DD
    const currency = searchParams.get('currency') || 'usd';

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD.' },
            { status: 400 }
        );
    }

    if (currency !== 'usd' && currency !== 'eur') {
        return NextResponse.json(
            { error: 'Currency must be usd or eur.' },
            { status: 400 }
        );
    }

    // Check cache
    const cached = priceCache.get(date);
    if (cached) {
        return NextResponse.json({
            price: cached[currency],
            currency,
            date,
        });
    }

    try {
        // CoinGecko expects DD-MM-YYYY
        const [year, month, day] = date.split('-');
        const cgDate = `${day}-${month}-${year}`;

        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${cgDate}&localization=false`,
            {
                headers: { Accept: 'application/json' },
                next: { revalidate: 86400 }, // Cache for 24h (historical data doesn't change)
            }
        );

        if (!res.ok) {
            // Rate limit or other error
            return NextResponse.json(
                { error: 'Failed to fetch Bitcoin price.', price: null },
                { status: 502 }
            );
        }

        const data = await res.json();
        const marketData = data?.market_data?.current_price;

        if (!marketData) {
            return NextResponse.json(
                { error: 'No price data available for this date.', price: null },
                { status: 404 }
            );
        }

        const prices = {
            usd: Math.round(marketData.usd * 100) / 100,
            eur: Math.round(marketData.eur * 100) / 100,
        };

        // Cache the result
        priceCache.set(date, prices);

        return NextResponse.json({
            price: prices[currency],
            currency,
            date,
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch Bitcoin price.' },
            { status: 500 }
        );
    }
}
