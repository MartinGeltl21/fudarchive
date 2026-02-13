import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <p className={styles.tagline}>{t('tagline')}</p>
                <p className={styles.built}>
                    {t('builtWith')} <span className={styles.heart}>♥</span> &amp; ₿
                </p>
            </div>
            <div className={`container ${styles.impressum}`}>
                <p className={styles.impressumText}>
                    {t('impressum')}: <a href="mailto:bitcoinohnestrom@proton.me" className={styles.impressumLink}>bitcoinohnestrom@proton.me</a>
                </p>
            </div>
        </footer>
    );
}
