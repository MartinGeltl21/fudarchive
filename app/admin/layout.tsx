import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | FUD Archive',
    robots: 'noindex, nofollow',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="dark" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
