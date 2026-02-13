'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createPortal } from 'react-dom';
import { Submission } from '@/lib/types';
import { useCurrency } from '@/components/CurrencyContext/CurrencyContext';
import PlatformBadge from '@/components/PlatformBadge/PlatformBadge';
import TopicTag from '@/components/TopicTag/TopicTag';
import styles from './Lightbox.module.css';

interface LightboxProps {
    submission: Submission;
    onClose: () => void;
}

export default function Lightbox({ submission, onClose }: LightboxProps) {
    const t = useTranslations();
    const { currency } = useCurrency();
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [priceLoading, setPriceLoading] = useState(true);
    const [closing, setClosing] = useState(false);

    const platformLabel = t(`platforms.${submission.platform}`);
    const topicLabel = t(`topics.${submission.topic}`);
    const formattedDate = new Date(submission.source_date).toLocaleDateString(
        submission.language === 'de' ? 'de-DE' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    // Fetch BTC price for this date
    useEffect(() => {
        const fetchPrice = async () => {
            setPriceLoading(true);
            try {
                const res = await fetch(
                    `/api/bitcoin-price?date=${submission.source_date}&currency=${currency}`
                );
                const data = await res.json();
                if (data.price != null) {
                    setBtcPrice(data.price);
                } else {
                    setBtcPrice(null);
                }
            } catch {
                setBtcPrice(null);
            } finally {
                setPriceLoading(false);
            }
        };
        fetchPrice();
    }, [submission.source_date, currency]);

    // Close with animation
    const handleClose = useCallback(() => {
        setClosing(true);
        setTimeout(onClose, 250);
    }, [onClose]);

    // Escape key + prevent scrollbar layout shift
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handler);

        // Prevent scrollbar layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [handleClose]);

    const formatPrice = (price: number) => {
        const symbol = currency === 'usd' ? '$' : '€';
        return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const content = (
        <div
            className={`${styles.overlay} ${closing ? styles.closing : ''}`}
            onClick={handleClose}
        >
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <div className={styles.imageContainer}>
                    <Image
                        src={submission.image_url}
                        alt={submission.description || 'Bitcoin FUD Screenshot'}
                        fill
                        sizes="90vw"
                        className={styles.image}
                        priority
                    />
                </div>

                {/* Info Bar */}
                <div className={styles.info}>
                    <div className={styles.infoLeft}>
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

                    <div className={styles.priceBox}>
                        <span className={styles.priceLabel}>
                            ₿ {t('bitcoin.priceOn')}
                        </span>
                        {priceLoading ? (
                            <span className={styles.priceValue}>...</span>
                        ) : btcPrice != null ? (
                            <span className={styles.priceValue}>
                                {formatPrice(btcPrice)}
                            </span>
                        ) : (
                            <span className={styles.priceNA}>N/A</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
