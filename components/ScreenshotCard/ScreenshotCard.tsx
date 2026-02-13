'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Submission } from '@/lib/types';
import PlatformBadge from '@/components/PlatformBadge/PlatformBadge';
import TopicTag from '@/components/TopicTag/TopicTag';
import styles from './ScreenshotCard.module.css';

export default function ScreenshotCard({
    submission,
}: {
    submission: Submission;
}) {
    const t = useTranslations();
    const platformLabel = t(`platforms.${submission.platform}`);
    const topicLabel = t(`topics.${submission.topic}`);
    const formattedDate = new Date(submission.source_date).toLocaleDateString(
        submission.language === 'de' ? 'de-DE' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    const handleClick = () => {
        window.open(submission.image_url, '_blank');
    };

    return (
        <article className={`card ${styles.card}`} onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className={styles.imageWrapper}>
                <Image
                    src={submission.image_url}
                    alt={submission.description || 'Bitcoin FUD Screenshot'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <PlatformBadge platform={submission.platform} label={platformLabel} />
                    <TopicTag topic={submission.topic} label={topicLabel} />
                </div>
                <time className={styles.date} dateTime={submission.source_date}>
                    {formattedDate}
                </time>
                {submission.description && (
                    <p className={styles.description}>{submission.description}</p>
                )}
            </div>
        </article>
    );
}

