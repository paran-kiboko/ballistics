import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';

i18n
    .use(LanguageDetector) // 브라우저 언어 자동 감지
    .use(initReactI18next) // react-i18next 연결
    .init({
        resources: {
            en: { translation: en },
            ko: { translation: ko },
            ja: { translation: ja },
            th: { translation: th },
            vi: { translation: vi },
            zh: { translation: zh },
        },
        // lng: 'th',
        // fallbackLng: 'en', // 감지 실패시 기본 언어
        interpolation: {
            escapeValue: false, // React는 자동으로 XSS 보호
        },
    });

export default i18n;
