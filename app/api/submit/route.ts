import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const VALID_PLATFORMS = ['twitter', 'reddit', 'youtube', 'facebook', 'linkedin', 'news', 'other'];
const VALID_TOPICS = ['bubble', 'scam', 'environment', 'obituary', 'regulation', 'other'];
const VALID_LANGUAGES = ['en', 'de'];

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const ip =
            headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            headersList.get('x-real-ip') ||
            'unknown';

        // Rate limit check
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            );
        }

        const formData = await request.formData();

        // Honeypot check (silently reject)
        const honeypot = formData.get('honeypot');
        if (honeypot) {
            // Pretend success to not tip off bots
            return NextResponse.json({ success: true });
        }

        // Extract fields
        const image = formData.get('image') as File | null;
        const platform = formData.get('platform') as string | null;
        const sourceDate = formData.get('source_date') as string | null;
        const topic = formData.get('topic') as string | null;
        const language = formData.get('language') as string | null;
        const description = formData.get('description') as string | null;

        // Validate required fields
        if (!image || !platform || !sourceDate || !topic) {
            return NextResponse.json(
                { error: 'Missing required fields.' },
                { status: 400 }
            );
        }

        // Validate image
        if (!ALLOWED_TYPES.includes(image.type)) {
            return NextResponse.json(
                { error: 'Invalid image format. Only JPG, PNG, and WebP allowed.' },
                { status: 400 }
            );
        }

        if (image.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'Image too large. Max 5 MB.' },
                { status: 400 }
            );
        }

        // Validate fields
        if (!VALID_PLATFORMS.includes(platform)) {
            return NextResponse.json({ error: 'Invalid platform.' }, { status: 400 });
        }

        if (!VALID_TOPICS.includes(topic)) {
            return NextResponse.json({ error: 'Invalid topic.' }, { status: 400 });
        }

        const lang = language && VALID_LANGUAGES.includes(language) ? language : 'en';

        // Validate date
        const date = new Date(sourceDate);
        if (isNaN(date.getTime()) || date > new Date()) {
            return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
        }

        // Validate description
        if (description && description.length > 280) {
            return NextResponse.json(
                { error: 'Description too long. Max 280 characters.' },
                { status: 400 }
            );
        }

        // Upload to Supabase Storage
        const supabase = createServiceClient();
        const ext = image.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const filePath = `submissions/${fileName}`;

        const buffer = Buffer.from(await image.arrayBuffer());

        const { error: uploadError } = await supabase.storage
            .from('screenshots')
            .upload(filePath, buffer, {
                contentType: image.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json(
                { error: 'Failed to upload image.' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('screenshots')
            .getPublicUrl(filePath);

        // Insert into database
        const { error: insertError } = await supabase.from('submissions').insert({
            image_url: urlData.publicUrl,
            image_path: filePath,
            platform,
            source_date: sourceDate,
            topic,
            language: lang,
            description: description || null,
            submitted_by_ip: ip,
            status: 'pending',
        });

        if (insertError) {
            // Clean up uploaded file
            await supabase.storage.from('screenshots').remove([filePath]);
            return NextResponse.json(
                { error: 'Failed to save submission.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
