import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './page.module.css';

export default function SuccessPage() {
    const t = useTranslations('success');

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.icon}>✓</div>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.message}>{t('message')}</p>
                <div className={styles.actions}>
                    <Link href="/submit" className="btn btn-secondary">
                        {t('another')}
                    </Link>
                    <Link href="/" className="btn btn-primary">
                        {t('browse')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
