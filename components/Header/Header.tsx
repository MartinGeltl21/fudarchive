'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import CurrencyToggle from '@/components/CurrencyToggle/CurrencyToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

export default function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>₿</span>
                    <span className={styles.logoText}>FUD Archive</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>
                        {t('home')}
                    </Link>
                    <Link href="/submit" className={styles.navLink}>
                        {t('submit')}
                    </Link>
                </nav>

                <div className={styles.controls}>
                    <CurrencyToggle />
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
