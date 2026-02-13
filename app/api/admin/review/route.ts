import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

async function isAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return user.email === process.env.ADMIN_EMAIL;
}

// GET: List all submissions for admin (any status)
export async function GET(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const supabase = createServiceClient();
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: status === 'pending' });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submissions: data || [] });
}

// PATCH: Approve or reject a submission
export async function PATCH(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
        .from('submissions')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

// DELETE: Delete a submission (and its image)
export async function DELETE(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID.' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get image path
    const { data: sub } = await supabase
        .from('submissions')
        .select('image_path')
        .eq('id', id)
        .single();

    if (sub?.image_path) {
        await supabase.storage.from('screenshots').remove([sub.image_path]);
    }

    const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
