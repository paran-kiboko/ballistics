'use client';

import { useEffect, useState } from 'react';
import { getCurrentLanguage, changeLanguage } from '@/lib/i18n';

// 지원하는 언어 목록
const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    { code: 'th', name: 'ไทย' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: '中文' },
    { code: 'other', name: 'English', value: 'en' },
];

interface LanguageSelectorProps {
    compact?: boolean;
}

const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');

    // 컴포넌트 마운트 시 언어 설정 로드
    useEffect(() => {
        const currentLang = getCurrentLanguage();
        setSelectedLanguage(currentLang);
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const langCode = e.target.value;
        setSelectedLanguage(langCode);
        changeLanguage(langCode);

        // 언어 변경 시 페이지 새로고침 (전체 앱에 적용하기 위해)
        window.location.reload();
    };

    return <></>

    if (!selectedLanguage) return null; // 초기 로딩 중에는 렌더링하지 않음

    return (
        <div className="language-selector">
            <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className={`${compact
                    ? 'text-xs py-1 px-1'
                    : 'text-sm py-1 px-2'} 
                    bg-white border border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
                aria-label="언어 선택"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code === 'other' ? (lang.value || lang.code) : lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector; 