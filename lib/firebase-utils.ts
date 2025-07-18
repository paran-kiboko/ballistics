import { analytics } from '@/firebase';
import { logEvent, setAnalyticsCollectionEnabled } from 'firebase/analytics';

// 특정 이벤트를 추적하는 유틸리티 함수
export const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
) => {
    if (analytics) {
        console.log('trackEvent', eventName, eventParams);
        logEvent(analytics, eventName, eventParams);
    }
};

// 자주 사용되는 이벤트들에 대한 헬퍼 함수들
export const trackPageView = (pagePath: string) => {
    trackEvent('page_view', {
        page_path: pagePath,
        page_location: typeof window !== 'undefined' ? window.location.href : undefined,
        page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
};

export const trackButtonClick = (buttonId: string, buttonText?: string, user_id?: string) => {
    trackEvent('button_click', {
        button_id: buttonId,
        button_text: buttonText,
        user_id: user_id,
    });
};

export const trackFormSubmit = (formId: string, formName?: string) => {
    trackEvent('form_submit', {
        form_id: formId,
        form_name: formName,
    });
};

export const trackSearch = (searchTerm: string, searchType?: string) => {
    trackEvent('search', {
        search_term: searchTerm,
        search_type: searchType,
    });
};

export const trackLogin = (method: string) => {
    trackEvent('login', {
        method: method,
    });
};

export const trackSignUp = (method: string) => {
    trackEvent('sign_up', {
        method: method,
    });
};

// 분석 데이터 수집을 활성화/비활성화하는 함수 (개인정보 옵션 등에 사용)
export const setAnalyticsEnabled = (enabled: boolean) => {
    if (analytics) {
        setAnalyticsCollectionEnabled(analytics, enabled);
    }

    // 사용자의 선택을 브라우저에 저장
    if (typeof window !== 'undefined') {
        localStorage.setItem('analytics_enabled', enabled ? 'true' : 'false');
    }
};

// 사용자의 분석 선택 가져오기
export const isAnalyticsEnabled = (): boolean => {
    if (typeof window !== 'undefined') {
        const storedPreference = localStorage.getItem('analytics_enabled');
        // 기본값은 true
        return storedPreference === null ? true : storedPreference === 'true';
    }
    return true;
}; 