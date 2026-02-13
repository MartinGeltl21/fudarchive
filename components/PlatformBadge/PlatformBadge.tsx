import { Platform } from '@/lib/types';
import styles from './PlatformBadge.module.css';

const PLATFORM_ICONS: Record<Platform, string> = {
    twitter: '𝕏',
    reddit: '⟁',
    youtube: '▶',
    facebook: 'f',
    linkedin: 'in',
    news: '📰',
    other: '•',
};

export default function PlatformBadge({
    platform,
    label,
}: {
    platform: Platform;
    label: string;
}) {
    return (
        <span className={`${styles.badge} ${styles[platform]}`}>
            <span className={styles.icon}>{PLATFORM_ICONS[platform]}</span>
            <span className={styles.label}>{label}</span>
        </span>
    );
}
