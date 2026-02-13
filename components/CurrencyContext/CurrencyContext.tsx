'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'usd' | 'eur';

interface CurrencyContextType {
    currency: Currency;
    toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'usd',
    toggleCurrency: () => { },
});

export function useCurrency() {
    return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('usd');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('fud-currency') as Currency | null;
        if (stored === 'usd' || stored === 'eur') {
            setCurrency(stored);
        }
        setMounted(true);
    }, []);

    const toggleCurrency = () => {
        setCurrency((prev) => {
            const next = prev === 'usd' ? 'eur' : 'usd';
            localStorage.setItem('fud-currency', next);
            return next;
        });
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}
