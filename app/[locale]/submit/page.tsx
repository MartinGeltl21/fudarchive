'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { PLATFORMS, TOPICS } from '@/lib/types';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import styles from './page.module.css';

export default function SubmitPage() {
    const t = useTranslations();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [platform, setPlatform] = useState('');
    const [sourceDate, setSourceDate] = useState('');
    const [topic, setTopic] = useState('');
    const [language, setLanguage] = useState('en');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!file) newErrors.image = t('submit.errors.imageRequired');
        if (!platform) newErrors.platform = t('submit.errors.platformRequired');
        if (!sourceDate) newErrors.date = t('submit.errors.dateRequired');
        if (sourceDate && new Date(sourceDate) > new Date()) {
            newErrors.date = t('submit.errors.dateFuture');
        }
        if (!topic) newErrors.topic = t('submit.errors.topicRequired');
        if (description.length > 280) {
            newErrors.description = t('submit.errors.descriptionTooLong');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate() || !file) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('platform', platform);
            formData.append('source_date', sourceDate);
            formData.append('topic', topic);
            formData.append('language', language);
            if (description) formData.append('description', description);
            // Honeypot
            const honeypot = (document.getElementById('website_url') as HTMLInputElement)?.value;
            if (honeypot) formData.append('honeypot', honeypot);

            const res = await fetch('/api/submit', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Submit failed');
            }

            router.push('/submit/success');
        } catch {
            setErrors({ submit: t('submit.errors.submitFailed') });
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageError = (type: string) => {
        if (type === 'size') {
            setErrors((prev) => ({ ...prev, image: t('submit.errors.imageTooLarge') }));
        } else {
            setErrors((prev) => ({ ...prev, image: t('submit.errors.imageFormat') }));
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{t('submit.title')}</h1>
                        <p className={styles.subtitle}>{t('submit.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        {/* Image Upload */}
                        <div className="form-group">
                            <label className="form-label">{t('submit.image')}</label>
                            <ImageUpload
                                dragText={t('submit.imageDrag')}
                                hintText={t('submit.imageHint')}
                                errorText={errors.image}
                                onFileSelect={(f) => {
                                    setFile(f);
                                    setErrors((prev) => {
                                        const next = { ...prev };
                                        delete next.image;
                                        return next;
                                    });
                                }}
                                onError={handleImageError}
                            />
                        </div>

                        {/* Platform */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="platform">
                                {t('submit.platform')}
                            </label>
                            <select
                                id="platform"
                                className={`form-select ${errors.platform ? 'form-error-border' : ''}`}
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            >
                                <option value="">{t('submit.platformPlaceholder')}</option>
                                {PLATFORMS.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {t(`platforms.${p.value}`)}
                                    </option>
                                ))}
                            </select>
                            {errors.platform && <p className="form-error">{errors.platform}</p>}
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="source_date">
                                {t('submit.date')}
                            </label>
                            <input
                                type="date"
                                id="source_date"
                                className="form-input"
                                value={sourceDate}
                                onChange={(e) => setSourceDate(e.target.value)}
                                max={today}
                            />
                            <span className="form-hint">{t('submit.dateHint')}</span>
                            {errors.date && <p className="form-error">{errors.date}</p>}
                        </div>

                        {/* Topic */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="topic">
                                {t('submit.topic')}
                            </label>
                            <select
                                id="topic"
                                className="form-select"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                <option value="">{t('submit.topicPlaceholder')}</option>
                                {TOPICS.map((tp) => (
                                    <option key={tp.value} value={tp.value}>
                                        {t(`topics.${tp.value}`)}
                                    </option>
                                ))}
                            </select>
                            {errors.topic && <p className="form-error">{errors.topic}</p>}
                        </div>

                        {/* Language of post */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="language">
                                {t('submit.language')}
                            </label>
                            <select
                                id="language"
                                className="form-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">
                                {t('submit.description')}
                            </label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('submit.descriptionPlaceholder')}
                                maxLength={280}
                                rows={3}
                            />
                            <span className="form-hint">
                                {t('submit.descriptionHint')} ({description.length}/280)
                            </span>
                            {errors.description && (
                                <p className="form-error">{errors.description}</p>
                            )}
                        </div>

                        {/* Honeypot (hidden) */}
                        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                            <label htmlFor="website_url">Website</label>
                            <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
                        </div>

                        {errors.submit && (
                            <div className={styles.submitError}>
                                <p className="form-error">{errors.submit}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                            disabled={submitting}
                        >
                            {submitting ? t('submit.submitting') : t('submit.button')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
