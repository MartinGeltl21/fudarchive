import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { CurrencyProvider } from '@/components/CurrencyContext/CurrencyContext';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} data-theme="dark" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <CurrencyProvider>
                        <NextIntlClientProvider messages={messages}>
                            <Header />
                            <main>{children}</main>
                            <Footer />
                        </NextIntlClientProvider>
                    </CurrencyProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
