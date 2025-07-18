'use client';

import React, { ReactNode, useEffect } from 'react';
import { trackEvent } from '@/lib/firebase-utils';

interface AnalyticsTrackerProps {
    eventName: string;
    eventParams?: Record<string, any>;
    children: ReactNode;
    onClick?: () => void;
}

/**
 * 클릭 이벤트를 추적하는 컴포넌트
 * 사용 예시:
 * <AnalyticsTracker eventName="button_click" eventParams={{ button_id: "login" }}>
 *   <button>로그인</button>
 * </AnalyticsTracker>
 */
export default function AnalyticsTracker({
    eventName,
    eventParams,
    children,
    onClick,
}: AnalyticsTrackerProps) {
    const handleClick = () => {

        // 이벤트 추적
        trackEvent(eventName, eventParams);

        // 원래의 onClick 핸들러가 있으면 호출
        if (onClick) {
            onClick();
        }
    };

    // 단일 자식이고 React 요소인 경우 클릭 핸들러를 추가
    if (React.isValidElement(children)) {
        // 기존 onClick이 있으면 합쳐서 처리
        const childOnClick = (children.props as any).onClick;
        const combinedOnClick = (e: React.MouseEvent) => {
            handleClick();
            if (childOnClick) childOnClick(e);
        };

        return React.cloneElement(children, {
            onClick: combinedOnClick,
        } as any);
    }

    // 여러 자식이거나 텍스트 노드인 경우 div로 감싸서 처리
    return (
        <div onClick={handleClick}>
            {children}
        </div>
    );
}

/**
 * 화면 노출 이벤트를 추적하는 컴포넌트
 * 사용 예시:
 * <ImpressionTracker eventName="product_view" eventParams={{ product_id: "123" }}>
 *   <ProductCard />
 * </ImpressionTracker>
 */
export function ImpressionTracker({
    eventName,
    eventParams,
    children,
}: Omit<AnalyticsTrackerProps, 'onClick'>) {
    useEffect(() => {
        // 컴포넌트가 마운트될 때 한 번 이벤트 추적
        trackEvent(eventName, eventParams);
    }, [eventName, eventParams]);

    return <>{children}</>;
} 