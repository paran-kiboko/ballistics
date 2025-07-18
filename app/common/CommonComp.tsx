import React, { useEffect, useState } from 'react';
import CompModalLoading from './CompModalLoading';
import { setAlertMessage, setUserGuideMessage } from '@/store/admin/mainAdmin';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import Svc from '@/service/Svc';
import { CircleArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModalChat from './ModalChat';
const CommonComp = () => {
    return (
        <>
            <Alert />
            <UserGuide />
            <CompModalLoading />
            <ModalChat />
        </>
    );
};

export default CommonComp;

const Alert = () => {
    const alertMessage = useSelector((state: RootState) => state.main.alertMessage);
    const dispatch = useDispatch();
    const safeArea = useSelector((state: RootState) => state.main.safeArea);
    const { t } = useTranslation();
    if (alertMessage) {
        const alertParams = Svc.simpleData.alertParams;
        return <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" style={{ zIndex: 5000 }}>
            <div className="bg-white rounded-[4px] w-[320px] p-4 animate__animated animate__fadeIn animate__faster">
                <div className="text-center pt-4 pb-6 px-2">
                    <div className="text-base font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: alertMessage }}></div>
                </div>
                {Svc.simpleData.alertParams?.isConfirm ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                Svc.onHaptic();
                                if (Svc.simpleData.alertParams) {
                                    Svc.simpleData.alertParams.callback && Svc.simpleData.alertParams.callback(true);
                                    setTimeout(() => {
                                        Svc.simpleData.alertParams = null;
                                    }, 100);
                                }
                                dispatch(setAlertMessage(''));
                            }}
                            className="flex-1 flex items-center justify-center bg-[#2E2E2E] text-white text-base font-medium hover:bg-[#2E2E2E] transition-colors border-none rounded-[4px] h-[40px]"
                        >
                            {alertParams?.confirmText || 'Confirm'}
                        </button>
                        <button
                            onClick={() => {
                                Svc.onHaptic();
                                if (Svc.simpleData.alertParams) {
                                    Svc.simpleData.alertParams.callback && Svc.simpleData.alertParams.callback(false);
                                    setTimeout(() => {
                                        Svc.simpleData.alertParams = null;
                                    }, 100);
                                }
                                dispatch(setAlertMessage(''));
                            }}
                            className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 text-base font-medium hover:bg-gray-300 transition-colors border-none rounded-[4px] h-[40px]"
                        >
                            {alertParams?.cancelText || t('txt5')}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            Svc.onHaptic();
                            if (Svc.simpleData.alertParams) {
                                Svc.simpleData.alertParams.callback && Svc.simpleData.alertParams.callback(true);
                                setTimeout(() => {
                                    Svc.simpleData.alertParams = null;
                                }, 100);
                            }
                            dispatch(setAlertMessage(''));
                        }}
                        className="w-full flex items-center justify-center bg-[#2E2E2E] text-white text-base font-medium hover:bg-[#2E2E2E] transition-colors border-none rounded-[4px] h-[40px]"
                    >
                        {alertParams?.confirmText || 'Confirm'}
                    </button>
                )}
            </div>
        </div>;
    }
    return null;
}
let userGuideTimeout: any;
const UserGuide = () => {
    const safeArea = useSelector((state: RootState) => state.main.safeArea);
    const userGuideMessage = useSelector((state: RootState) => state.main.userGuideMessage);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!userGuideMessage) return;
        userGuideTimeout = setTimeout(onClose, Svc.simpleData.userGuide.duration);

        // Add click event listener to handle clicks outside the component
        const handleOutsideClick = (e: MouseEvent) => {
            const userGuideElement = document.querySelector('.UserGuide');
            if (userGuideElement && !userGuideElement.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [userGuideMessage]);

    const onClose = () => {
        Svc.simpleData.userGuide = null;
        userGuideTimeout = null;
        dispatch(setUserGuideMessage(''));
    }

    if (!userGuideMessage) return null;

    return (
        <div
            className="UserGuide animate__animated animate__fadeInUp animate__faster"
            style={{
                position: 'fixed',
                bottom: safeArea.bottom + 36,
                left: '5%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fff',
                zIndex: 4000,
                color: '#333',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                outline: '1px solid rgba(0, 0, 0, 0.12)',
                padding: '10px 10px',
                maxWidth: '90%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textAlign: 'center',
                width: '100%',
            }}
            onClick={() => {
                Svc.onHaptic();
                Svc.simpleData.userGuide.callback && Svc.simpleData.userGuide.callback();
                onClose();
            }}
        >
            <div className="emoji animate__animated animate__pulse animate__delay-2s" style={{ fontSize: '2.5rem' }}>
                {Svc.simpleData.userGuide.emoji}
            </div>
            <div className="message animate__animated animate__pulse animate__delay-2s" style={{
                fontSize: '0.95rem',
                fontWeight: '500',
                lineHeight: '1.4'
            }} dangerouslySetInnerHTML={{ __html: userGuideMessage }}>

            </div>
            {Svc.simpleData.userGuide.isNextIcon && <CircleArrowRightIcon className="w-6 h-6 animate__animated animate__pulse animate__delay-s" />}
        </div>
    );
};