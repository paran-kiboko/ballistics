'use client';

import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from "@/store";
import i18n from '@/lib/i18n';
import { CONFIG_ENV } from '@/lib/config';
export default function ReduxProviderClient({
    children
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || CONFIG_ENV.DEFAULT_MY_LANGUAGE;
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, []);

    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
}