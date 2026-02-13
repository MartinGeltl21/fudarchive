import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FUD Archive',
  description: 'A public archive of bad Bitcoin takes.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
