'use client';

import { useCurrency } from '@/components/CurrencyContext/CurrencyContext';
import styles from './CurrencyToggle.module.css';

export default function CurrencyToggle() {
    const { currency, toggleCurrency } = useCurrency();

    return (
        <button
            className={styles.toggle}
            onClick={toggleCurrency}
            aria-label={`Switch to ${currency === 'usd' ? 'EUR' : 'USD'}`}
            title={currency === 'usd' ? 'BTC/USD → BTC/EUR' : 'BTC/EUR → BTC/USD'}
        >
            <span className={`${styles.icon} ${currency === 'usd' ? styles.active : ''}`}>
                $
            </span>
            <span className={`${styles.icon} ${currency === 'eur' ? styles.active : ''}`}>
                €
            </span>
        </button>
    );
}
