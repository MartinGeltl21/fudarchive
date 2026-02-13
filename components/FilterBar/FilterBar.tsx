'use client';

import { useTranslations } from 'next-intl';
import { PLATFORMS, TOPICS, Platform, SubmissionTopic } from '@/lib/types';
import styles from './FilterBar.module.css';

interface FilterState {
    language: string;
    platform: string;
    year: string;
    topic: string;
    search: string;
}

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onReset: () => void;
    availableYears: number[];
}

export default function FilterBar({
    filters,
    onFilterChange,
    onReset,
    availableYears,
}: FilterBarProps) {
    const t = useTranslations();
    const hasActiveFilters = Object.values(filters).some((v) => v !== '');

    return (
        <div className={styles.bar}>
            <div className={styles.filters}>
                {/* Language filter */}
                <select
                    className={`form-select ${styles.select}`}
                    value={filters.language}
                    onChange={(e) => onFilterChange('language', e.target.value)}
                    aria-label={t('filter.language')}
                >
                    <option value="">{t('filter.language')}: {t('filter.all')}</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                </select>

                {/* Platform filter */}
                <select
                    className={`form-select ${styles.select}`}
                    value={filters.platform}
                    onChange={(e) => onFilterChange('platform', e.target.value)}
                    aria-label={t('filter.platform')}
                >
                    <option value="">{t('filter.platform')}: {t('filter.all')}</option>
                    {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                            {t(`platforms.${p.value}`)}
                        </option>
                    ))}
                </select>

                {/* Year filter */}
                <select
                    className={`form-select ${styles.select}`}
                    value={filters.year}
                    onChange={(e) => onFilterChange('year', e.target.value)}
                    aria-label={t('filter.year')}
                >
                    <option value="">{t('filter.year')}: {t('filter.all')}</option>
                    {availableYears.map((y) => (
                        <option key={y} value={y.toString()}>
                            {y}
                        </option>
                    ))}
                </select>

                {/* Topic filter */}
                <select
                    className={`form-select ${styles.select}`}
                    value={filters.topic}
                    onChange={(e) => onFilterChange('topic', e.target.value)}
                    aria-label={t('filter.topic')}
                >
                    <option value="">{t('filter.topic')}: {t('filter.all')}</option>
                    {TOPICS.map((tp) => (
                        <option key={tp.value} value={tp.value}>
                            {t(`topics.${tp.value}`)}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.searchRow}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className={`form-input ${styles.searchInput}`}
                        placeholder={t('filter.search')}
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {hasActiveFilters && (
                    <button className="btn btn-ghost btn-sm" onClick={onReset}>
                        {t('filter.reset')}
                    </button>
                )}
            </div>
        </div>
    );
}
