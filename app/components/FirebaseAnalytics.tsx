'use client';

import { useEffect } from 'react';
import { analytics } from '@/firebase';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { useSession } from 'next-auth/react';
import { setupGlobalFocusWithoutScroll } from '@/app/hooks/useFocusWithoutScroll';

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    // 전역 포커스 동작 설정
    useEffect(() => {
        // 모든 HTML 요소의 focus 메서드를 오버라이드하여 preventScroll: true로 설정
        setupGlobalFocusWithoutScroll();
    }, []);

    // 페이지 조회 추적
    useEffect(() => {
        if (analytics) {
            // 페이지 조회 이벤트 기록
            logEvent(analytics, 'page_view', {
                page_path: pathname,
                page_location: window.location.href,
                page_title: document.title,
            });
            console.log('Firebase Analytics page_view event sent', pathname);
        }
    }, [pathname, searchParams]); // 페이지나 검색 파라미터가 변경될 때마다 이벤트 전송

    // 사용자 정보 설정
    useEffect(() => {
        if (analytics && session?.user) {
            // 사용자 ID 설정 (로그인한 사용자 추적)
            if (session.user.id) {
                setUserId(analytics, session.user.id);
            }

            // 사용자 속성 설정
            setUserProperties(analytics, {
                // 기본 사용자 속성만 사용
                hasEmail: !!session.user.email,
                hasImage: !!session.user.image,
                // 필요한 경우 더 많은 사용자 속성 추가 가능
            });

            console.log('Firebase Analytics user identified', session.user.id);
        }
    }, [session]);

    // 유틸리티 함수: 커스텀 이벤트 로깅을 위한 함수
    // 이 함수는 컴포넌트에서 export되므로 다른 컴포넌트에서 import하여 사용 가능
    const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
        if (analytics) {
            logEvent(analytics, eventName, eventParams);
            console.log(`Firebase Analytics event tracked: ${eventName}`, eventParams);
        }
    };

    // 전역 window 객체에 추적 함수 추가 (필요한 경우 다른 스크립트에서 사용 가능)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).trackAnalyticsEvent = trackEvent;
        }

        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).trackAnalyticsEvent;
            }
        };
    }, []);

    return null;
} 