'use client'
import { RootState } from '@/store';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { setIsShowModalBasic } from '@/store/admin/mainAdmin';
import Svc from '@/service/Svc';

const ModalBasic = () => {
    const isShowModalBasic = useSelector((state: RootState) => state.main.isShowModalBasic);
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!isShowModalBasic) {
            setIsClosing(false);
            return;
        }
    }, [isShowModalBasic]);

    const handleClose = () => {
        Svc.onHaptic();
        setIsClosing(true);
        setTimeout(() => {
            dispatch(setIsShowModalBasic(false));
        }, 300); // Animation duration
    };

    if (!isShowModalBasic) return null;

    return (
        <div className={`fixed inset-0 flex flex-col justify-end z-50 transition-all duration-300 ${isClosing ? 'bg-black/0' : 'bg-black/50'}`}>
            <div className="h-[10vh] bg-transparent" onClick={handleClose} />
            <div className={`bg-white rounded-t-lg flex-1 shadow-2xl animate__animated ${isClosing ? 'animate__fadeOutDown' : 'animate__fadeInUp'} animate__faster flex flex-col max-h-[90vh]`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-xl font-medium">날짜 및 시간을 선택하세요</div>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content goes here */}

                </div>
            </div>
        </div>
    );
};

export default ModalBasic;