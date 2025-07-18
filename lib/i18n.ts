import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import th from '../locales/th.json';
import vi from '../locales/vi.json';



/**
 * 현재 선택된 언어 코드를 가져오는 함수
 * 브라우저 환경에서만 사용 가능
 */
export const getCurrentLanguage = (): string => {
    if (typeof window === 'undefined') {
        return 'ko'; // 서버 사이드에서는 기본값 반환
    }

    // localStorage에서 언어 설정 가져오기
    const savedLang = localStorage.getItem('setting_from_lang');

    if (savedLang) {
        return savedLang;
    }

    // 브라우저 설정 언어 사용
    const browserLang = navigator.language.split('-')[0]; // 'ko-KR'에서 'ko'만 추출

    // 지원하는 언어인지 확인 (선택적)
    const supportedLanguages = ['ko', 'en', 'ja', 'zh', 'th', 'vi'];
    return supportedLanguages.includes(browserLang) ? browserLang : 'en';
};

/**
 * 언어 코드 변경 함수
 */
export const changeLanguage = (langCode: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('setting_from_lang', langCode);
    }
};

/**
 * 언어 코드에 따른 국가 코드 매핑
 */
export const languageToLocale: Record<string, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN',
    th: 'th-TH',
    vi: 'vi-VN',
    other: 'en-US'
};



/**
 * 현재 언어에 맞는 전체 로케일 코드 반환
 */
export const getCurrentLocale = (): string => {
    const lang = getCurrentLanguage();
    return languageToLocale[lang] || 'en-US';
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ko: { translation: ko },
            ja: { translation: ja },
            zh: { translation: zh },
            th: { translation: th },
            vi: { translation: vi }
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;