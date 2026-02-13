'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: 'en' | 'de') => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className={styles.switcher}>
            <button
                className={`${styles.lang} ${locale === 'en' ? styles.active : ''}`}
                onClick={() => switchLocale('en')}
                aria-label="English"
            >
                EN
            </button>
            <button
                className={`${styles.lang} ${locale === 'de' ? styles.active : ''}`}
                onClick={() => switchLocale('de')}
                aria-label="Deutsch"
            >
                DE
            </button>
        </div>
    );
}
