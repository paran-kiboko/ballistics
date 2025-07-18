'use client';

import React, { useState, useRef, useEffect } from 'react';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { LogOut, MessageSquare, ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import FeedbackModal from './FeedbackModal';
import Svc from '@/service/Svc';

interface SettingsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchor: React.RefObject<HTMLElement>;
}

const SettingsPopover = ({ isOpen, onClose, anchor }: SettingsPopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'opinion'>('bug');
    const [isFeedbackDropdownOpen, setIsFeedbackDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                anchor.current !== event.target &&
                !anchor.current?.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            if (anchor.current) {
                const rect = anchor.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + 10,
                    right: window.innerWidth - rect.right,
                });
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchor]);

    const handleFeedbackClick = (type: 'bug' | 'suggestion' | 'opinion') => {
        setFeedbackType(type);
        setIsFeedbackModalOpen(true);
        setIsFeedbackDropdownOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                ref={popoverRef}
                className="absolute bg-white rounded-md shadow-lg border border-gray-200 z-50 p-3 w-48 animate__animated animate__fadeIn animate__faster"
                style={{ top: `${position.top}px`, right: `${position.right}px` }}
            >
                <div className="space-y-3">
                    {/* <div className="space-y-2">
                        <button
                            onClick={() => setIsFeedbackDropdownOpen(!isFeedbackDropdownOpen)}
                            className="flex items-center justify-between text-gray-600 hover:text-blue-600 text-xs font-medium w-full p-1 rounded hover:bg-gray-100"
                        >
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-3 w-3" />
                                <span>Feedback</span>
                            </div>
                            <ChevronDown className={`h-3 w-3 transition-transform ${isFeedbackDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFeedbackDropdownOpen && (
                            <div className="pl-6 space-y-1">
                                <button
                                    onClick={() => handleFeedbackClick('bug')}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 text-xs font-medium w-full p-1 rounded hover:bg-gray-100"
                                >
                                    <span>버그 제보</span>
                                </button>
                                <button
                                    onClick={() => handleFeedbackClick('suggestion')}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-xs font-medium w-full p-1 rounded hover:bg-gray-100"
                                >
                                    <span>제안하기</span>
                                </button>
                                <button
                                    onClick={() => handleFeedbackClick('opinion')}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 text-xs font-medium w-full p-1 rounded hover:bg-gray-100"
                                >
                                    <span>의견 보내기</span>
                                </button>
                            </div>
                        )}
                    </div> */}

                    <div className="border-gray-200">
                        <button
                            onClick={() => {

                                Svc.sendMessage({
                                    type: 'LOGOUT',
                                    callback: () => {

                                        signOut({ callbackUrl: "/login" });
                                    }
                                });
                            }}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-xs font-medium w-full p-1 rounded hover:bg-gray-100"
                        >
                            <LogOut className="h-3 w-3" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                type={feedbackType}
            />
        </>
    );
};

export default SettingsPopover; 