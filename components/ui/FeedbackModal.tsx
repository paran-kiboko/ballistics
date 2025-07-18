'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'bug' | 'suggestion' | 'opinion';
}

const FeedbackModal = ({ isOpen, onClose, type }: FeedbackModalProps) => {
    const [feedback, setFeedback] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement feedback submission
        console.log('Feedback submitted:', { type, feedback });
        onClose();
    };

    const getTitle = () => {
        switch (type) {
            case 'bug':
                return '버그 제보';
            case 'suggestion':
                return '제안하기';
            case 'opinion':
                return '의견 보내기';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ zIndex: 3000 }}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{getTitle()}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="내용을 입력해주세요..."
                        required
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            제출
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal; 