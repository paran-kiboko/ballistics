import { RefObject, useEffect } from 'react';

/**
 * 스크롤 없이 포커스를 적용하는 커스텀 훅
 * @param ref 포커스를 적용할 요소의 ref
 * @param shouldFocus 포커스 적용 여부 (기본값: true)
 * @param dependencies 의존성 배열 (변경 시 포커스 적용)
 */
export function useFocusWithoutScroll<T extends HTMLElement>(
    ref: RefObject<T>,
    shouldFocus: boolean = true,
    dependencies: any[] = []
) {
    useEffect(() => {
        if (shouldFocus && ref.current) {
            // 기존 focus 메서드를 오버라이드
            const originalFocus = ref.current.focus;

            ref.current.focus = function (options?: FocusOptions) {
                return originalFocus.call(this, { preventScroll: true, ...options });
            };

            // 포커스 적용
            ref.current.focus({ preventScroll: true });

            // 클린업 함수: 원래 focus 메서드로 복원
            return () => {
                if (ref.current) {
                    ref.current.focus = originalFocus;
                }
            };
        }
    }, [ref, shouldFocus, ...dependencies]);
}

/**
 * 모든 input/textarea 요소의 focus 메서드를 오버라이드하여 preventScroll: true로 설정
 * 전역적으로 적용하기 위한 함수
 */
export function setupGlobalFocusWithoutScroll() {
    if (typeof window !== 'undefined') {
        // 원본 focus 메서드 저장
        const originalElementFocus = HTMLElement.prototype.focus;

        // focus 메서드 오버라이드
        HTMLElement.prototype.focus = function (options?: FocusOptions) {
            return originalElementFocus.call(this, { preventScroll: true, ...options });
        };
    }
}

export default useFocusWithoutScroll; 