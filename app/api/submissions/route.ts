import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const language = searchParams.get('language');
    const platform = searchParams.get('platform');
    const year = searchParams.get('year');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');

    const supabase = createServiceClient();
    let query = supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .order('source_date', { ascending: false })
        .range(page * limit, page * limit + limit - 1);

    if (language) query = query.eq('language', language);
    if (platform) query = query.eq('platform', platform);
    if (topic) query = query.eq('topic', topic);
    if (search) query = query.ilike('description', `%${search}%`);
    if (year) {
        query = query
            .gte('source_date', `${year}-01-01`)
            .lte('source_date', `${year}-12-31`);
    }

    const { data, count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get available years for filter dropdown
    const { data: yearData } = await supabase
        .from('submissions')
        .select('source_date')
        .eq('status', 'approved')
        .order('source_date', { ascending: false });

    const availableYears = yearData
        ? [...new Set(yearData.map((s) => new Date(s.source_date).getFullYear()))]
            .sort((a, b) => b - a)
        : [];

    return NextResponse.json({
        submissions: data || [],
        totalCount: count || 0,
        availableYears,
    });
}
