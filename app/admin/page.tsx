'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Submission, PLATFORMS, TOPICS } from '@/lib/types';
import styles from './page.module.css';

type TabStatus = 'pending' | 'approved' | 'rejected';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabStatus>('pending');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check auth
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/admin/login';
                return;
            }
            setAuthenticated(true);
            setChecking(false);
        };
        checkAuth();
    }, []);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/review?status=${activeTab}`);
            if (res.status === 401) {
                window.location.href = '/admin/login';
                return;
            }
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (authenticated) fetchSubmissions();
    }, [authenticated, activeTab, fetchSubmissions]);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            await fetch('/api/admin/review', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this submission permanently?')) return;
        setActionLoading(id);
        try {
            await fetch(`/api/admin/review?id=${id}`, { method: 'DELETE' });
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    if (checking) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Checking authentication...</div>
            </div>
        );
    }

    const getPlatformLabel = (value: string) =>
        PLATFORMS.find((p) => p.value === value)?.label || value;

    const getTopicLabel = (value: string) =>
        TOPICS.find((t) => t.value === value)?.label || value;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.headerLeft}>
                        <span className={styles.logoIcon}>₿</span>
                        <h1 className={styles.title}>Admin Dashboard</h1>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </header>

            <div className={styles.content}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    {(['pending', 'approved', 'rejected'] as TabStatus[]).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : submissions.length === 0 ? (
                    <div className={styles.empty}>
                        No {activeTab} submissions.
                    </div>
                ) : (
                    <div className={styles.list}>
                        {submissions.map((sub) => (
                            <div key={sub.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src={sub.image_url}
                                        alt="Submission"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="400px"
                                    />
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.metaItem}>
                                            📱 {getPlatformLabel(sub.platform)}
                                        </span>
                                        <span className={styles.metaItem}>
                                            🏷️ {getTopicLabel(sub.topic)}
                                        </span>
                                        <span className={styles.metaItem}>
                                            📅 {new Date(sub.source_date).toLocaleDateString()}
                                        </span>
                                        <span className={styles.metaItem}>
                                            🌐 {sub.language.toUpperCase()}
                                        </span>
                                    </div>
                                    {sub.description && (
                                        <p className={styles.cardDesc}>{sub.description}</p>
                                    )}
                                    <p className={styles.cardSubmitted}>
                                        Submitted: {new Date(sub.created_at).toLocaleString()}
                                    </p>
                                    <div className={styles.cardActions}>
                                        {activeTab === 'pending' && (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleAction(sub.id, 'approved')}
                                                    disabled={actionLoading === sub.id}
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleAction(sub.id, 'rejected')}
                                                    disabled={actionLoading === sub.id}
                                                >
                                                    ❌ Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleDelete(sub.id)}
                                            disabled={actionLoading === sub.id}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
