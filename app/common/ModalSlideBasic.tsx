'use client'
import { RootState } from '@/store';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ArrowLeft } from 'lucide-react';
import { setIsShowModalBasic } from '@/store/admin/mainAdmin';

const ModalSlideBasic = () => {
    const isShowModalBasic = useSelector((state: RootState) => state.main.isShowModalBasic);
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);
    const safeArea: any = useSelector((state: any) => state.main.safeArea);
    useEffect(() => {
        if (!isShowModalBasic) {
            setIsClosing(false);
        }
    }, [isShowModalBasic]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch(setIsShowModalBasic(false));
        }, 300);
    };

    if (!isShowModalBasic) return null;

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isClosing ? 'bg-black/0' : 'bg-black/50'}`}>
            <div
                className={`fixed inset-y-0 right-0 w-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform
                    ${isClosing ? 'translate-x-full animate__animated animate__slideOutRight animate__faster' : 'translate-x-0 animate__animated animate__slideInRight animate__faster'}`}
                style={{
                    paddingTop: safeArea.top,
                    paddingBottom: safeArea.bottom
                }}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between">
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div className="text-xl font-medium flex-1 text-center">과정 소개</div>
                        <div className="w-6"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Content goes here */}
                    </div>

                    <div className="p-4 border-t">
                        <button
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            onClick={() => {
                                // Add class logic here
                                handleClose();
                            }}
                        >
                            추가
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSlideBasic;