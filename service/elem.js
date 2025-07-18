

class elem {
    one(selector, parentSelector) {
        if (parentSelector) selector = `${parentSelector} ${selector}`;
        return (typeof selector === 'string') ? document.querySelector(selector) : selector;
    }
    all(selector) {
        return (typeof selector === 'string') ? document.querySelectorAll(selector) : selector;
    }
    find(selector, el) {
        const $el = (el || document).querySelectorAll(selector);
        // 객체가 하나인경우 대상 리턴
        if ($el.length === 1) {
            return $el[0];
        }
        return $el;
    }
    addClass(selector, classStr) {
        document.querySelectorAll(selector).forEach((el) => {
            el.classList.add(classStr);
        });
    }
    removeClass(selector, classStr) {
        document.querySelectorAll(selector).forEach((el) => {
            el.classList.remove(classStr);
        });
    }
    hasClass(selector, classStr) {
        return document.querySelector(selector).classList.contains(classStr);
    }
    replaceClass(selector, class1, class2) {
        document.querySelectorAll(selector).forEach((el) => {
            el.classList.replace(class1, class2);
        });
    }
    closest(selector, classStr) {
        return selector.closest(classStr);
    }
    css(selector, values) {

        const $el = this.one(selector);
        if (typeof values === 'string') {
            // get
            return $el ? $el.style[values] : '';
        } else {
            // set
            for (const k in values) {
                $el.style[k] = values[k];
            }
        }
    }
    scrollTop(selector, value) {
        const $el = this.one(selector);
        if (value) {
            // set
            $el.scrollTop = value;
        } else {
            // get
            return $el.scrollTop;
        }

    }
    // 터치 제어 또는 모달 제어시 body스크롤 제거
    lockBodyScroll(tf) {
        document.body.style.overflow = tf ? "hidden" : "";
    }
}

export default new elem();