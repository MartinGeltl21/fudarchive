import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip i18n middleware for admin routes
    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Skip i18n for API routes
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};
