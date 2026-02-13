'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Submission } from '@/lib/types';
import ScreenshotCard from '@/components/ScreenshotCard/ScreenshotCard';
import FilterBar from '@/components/FilterBar/FilterBar';
import styles from './page.module.css';

const PAGE_SIZE = 12;

interface FilterState {
    language: string;
    platform: string;
    year: string;
    topic: string;
    search: string;
}

const defaultFilters: FilterState = {
    language: '',
    platform: '',
    year: '',
    topic: '',
    search: '',
};

export default function GalleryPage() {
    const t = useTranslations();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    const fetchSubmissions = useCallback(
        async (pageNum: number, reset = false) => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set('page', pageNum.toString());
                params.set('limit', PAGE_SIZE.toString());
                if (filters.language) params.set('language', filters.language);
                if (filters.platform) params.set('platform', filters.platform);
                if (filters.year) params.set('year', filters.year);
                if (filters.topic) params.set('topic', filters.topic);
                if (filters.search) params.set('search', filters.search);

                const res = await fetch(`/api/submissions?${params.toString()}`);
                const data = await res.json();

                if (reset) {
                    setSubmissions(data.submissions);
                } else {
                    setSubmissions((prev) => [...prev, ...data.submissions]);
                }
                setTotalCount(data.totalCount);
                setHasMore(data.submissions.length === PAGE_SIZE);
                if (data.availableYears) {
                    setAvailableYears(data.availableYears);
                }
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            } finally {
                setLoading(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        setPage(0);
        fetchSubmissions(0, true);
    }, [filters, fetchSubmissions]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSubmissions(nextPage);
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>{t('hero.title')}</h1>
                    <p className={styles.subtitle}>{t('hero.subtitle')}</p>
                    {totalCount > 0 && (
                        <p className={styles.stats}>
                            <span className={styles.statsNumber}>{t('hero.stats', { count: totalCount })}</span>{' '}
                            {t('hero.statsLabel')}
                        </p>
                    )}
                </div>
            </section>

            {/* Filters + Gallery */}
            <section className="container">
                <div className={styles.content}>
                    <FilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        availableYears={availableYears}
                    />

                    {loading && submissions.length === 0 ? (
                        <div className={styles.grid}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={styles.skeleton}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonContent}>
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLineShort} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className={styles.empty}>
                            <p className={styles.emptyIcon}>📁</p>
                            <p className={styles.emptyText}>
                                {filters.language || filters.platform || filters.year || filters.topic || filters.search
                                    ? t('gallery.noResults')
                                    : t('gallery.empty')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.grid}>
                                {submissions.map((sub) => (
                                    <ScreenshotCard key={sub.id} submission={sub} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className={styles.loadMore}>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={loadMore}
                                        disabled={loading}
                                    >
                                        {loading ? '...' : t('gallery.loadMore')}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
