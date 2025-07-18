'use client'
import { RootState } from '@/store';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Info, Mail, Shield, LogOut, UserMinus, Lightbulb } from 'lucide-react';
import { setAlertMessage, setIsShowSettings } from '@/store/admin/mainAdmin';
import AuthStatus from '../login/AuthStatus';
import LogoutButton from '../login/LogoutButton';
import Svc from '@/service/Svc';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
const ModalSettings = () => {
    const isShowSettings = useSelector((state: RootState) => state.main.isShowSettings);
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);
    const safeArea = useSelector((state: RootState) => state.main.safeArea);
    const { data: session } = useSession();
    const [showFeatureRequestModal, setShowFeatureRequestModal] = useState(false);
    const [featureRequest, setFeatureRequest] = useState('');
    const appVersion = useSelector((state: RootState) => state.main.appVersion);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (!isShowSettings) {
            setIsClosing(false);
            setShowFeatureRequestModal(false);
        }
    }, [isShowSettings]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch(setIsShowSettings(false));
        }, 300); // Animation duration
    };

    const handleFeatureRequestSubmit = () => {
        if (!featureRequest.trim()) {
            dispatch(setAlertMessage(t('guide17')));
            return;
        }

        // Send feature request to backend or service
        // Svc.win.ChannelIO('showMessenger', {
        //     initialMessage: `[기능 요청]\n${featureRequest}`
        // });

        fetch('/api/send-suggest', {
            method: 'POST',
            body: JSON.stringify({ suggestType: '기능 요청', message: featureRequest, userId: session?.user?.id }),
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
            .finally(() => {
                // Reset and close modal
                setFeatureRequest('');
                setShowFeatureRequestModal(false);

                dispatch(setAlertMessage(t('guide13')));
            });


    };

    const handleWithdrawal = () => {
        Svc.simpleData.alertParams = {
            title: t('txt4'),
            message: t('txt4'),
            isConfirm: true,
            confirmText: t('txt4'),
            cancelText: t('txt5'),
            callback: () => {
                fetch('/api/set-delete-account', {
                    method: 'POST',
                    body: JSON.stringify({ userId: session?.user?.id }),
                })
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .catch(err => console.error(err))
                    .finally(() => {
                        Svc.sendMessage({
                            type: 'LOGOUT',
                            callback: async () => {
                                await signOut({ callbackUrl: "/login" });
                            }
                        });
                    });
            }
        }

        dispatch(setAlertMessage(`<h2 class="text-xl font-bold mb-6">${t('txt4')}</h2> 
                        <div style="text-align: left;">
                        <div>${t('guide14')}</div>
                        <div class="mb-6 text-red-500 text-sm">${t('guide15')}</div>
                        
        </div>`))
    };

    if (!isShowSettings) return null;

    return (
        <div className={`fixed inset-0 flex flex-col justify-end z-50 transition-all duration-300 ${isClosing ? 'bg-black/0' : 'bg-black/50'}`}>
            <div className="h-[10vh] bg-transparent" onClick={handleClose} />
            <div className={`bg-white rounded-t-lg flex-1 shadow-2xl animate__animated ${isClosing ? 'animate__fadeOutDown' : 'animate__fadeInUp'} animate__faster flex flex-col max-h-[90vh]`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-semibold text-gray-700">Settings</div>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Settings Content */}
                    <div className="space-y-4 flex-grow overflow-y-auto">
                        {/* App version */}
                        <div className="border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3 py-2">
                                <Info className="h-5 w-5 text-gray-500" />
                                <div className="flex text-gray-600 justify-between w-full">
                                    <span>App Version</span>
                                    <span className="text-gray-500">{appVersion}</span>
                                </div>
                            </div>
                        </div>

                        {/* Language Settings */}
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Language</h3>
                            <div className="w-full">
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none"
                                    value={i18n.language}
                                    onChange={(e) => {
                                        const selectedLanguage = e.target.value;
                                        i18n.changeLanguage(selectedLanguage);

                                        // Store the selected language in storage
                                        Svc.sendMessage({
                                            type: 'SET_STORAGE_DATA_WITH_KEY',
                                            data: {
                                                key: 'languageCode',
                                                value: selectedLanguage
                                            }
                                        });
                                    }}
                                >
                                    <option value="ko">🇰🇷 한국어</option>
                                    <option value="ja">🇯🇵 日本語</option>
                                    <option value="th">🇹🇭 ไทย</option>
                                    <option value="vi">🇻🇳 Tiếng Việt</option>
                                    <option value="zh">🇨🇳 中文</option>
                                    <option value="en">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Support & Info */}
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Support & Info</h3>

                            <div className="flex flex-col space-y-1">
                                <div className="flex text-gray-600 items-center gap-3 py-2.5 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors" onClick={() => {
                                    Svc.win.ChannelIO('showMessenger');
                                }}>
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <span>{t('txt6')}</span>
                                </div>

                                <div className="flex text-gray-600 items-center gap-3 py-2.5 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors" onClick={() => {
                                    setShowFeatureRequestModal(true);
                                }}>
                                    <Lightbulb className="h-5 w-5 text-gray-500" />
                                    <span>{t('txt3')}</span>
                                </div>

                                <div className="flex text-gray-600 items-center gap-3 py-2.5 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors" onClick={() => {
                                    Svc.sendMessage({
                                        type: 'OPEN_URL',
                                        url: 'https://www.freeprivacypolicy.com/live/28cb4643-37e1-4a97-85a9-89381e213d17',
                                    });
                                }}>
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    <span>{t('txt7')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account info */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Account Info</h3>
                            <AuthStatus />
                        </div>
                        {
                            Svc.isJay(session?.user?.id, session?.user?.email) && (
                                <DbgChangeUser />
                            )
                        }
                    </div>

                    {/* Bottom buttons with low prominence */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-8" style={{
                        paddingBottom: safeArea.bottom
                    }}>
                        <LogoutButton />
                        <button
                            onClick={handleWithdrawal}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-500 p-2 text-sm justify-center transition-colors"
                        >
                            <span>Remove Account</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Request Modal */}
            {showFeatureRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg w-[90%] max-w-md shadow-xl animate__animated animate__fadeInUp animate__faster">
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-700">{t('txt3')}</h3>
                                <button
                                    onClick={() => setShowFeatureRequestModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="text-gray-600 text-sm mb-4">
                                {t('guide16')}
                            </p>

                            <textarea
                                value={featureRequest}
                                onChange={(e) => setFeatureRequest(e.target.value)}
                                placeholder={t('guide17')}
                                className="w-full border border-gray-200 rounded-md p-3 text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:border-black min-h-[120px] text-[16px]"
                            />
                        </div>

                        <div className="p-5 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowFeatureRequestModal(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFeatureRequestSubmit}
                                className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalSettings;

const DbgChangeUser = () => {
    const [dbgUserId, setDbgUserId] = useState('');
    return (
        <div className="mt-4 border-t border-gray-100 pt-4 text-xs">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded-md p-2 text-sm text-gray-500"
                    placeholder="Enter command..."
                    value={dbgUserId}
                    onChange={(e) => setDbgUserId(e.target.value)}
                />
                <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                    onClick={() => {
                        Svc.dbgObj.dbgUserId = dbgUserId;
                    }}
                >
                    C
                </button>
            </div>
        </div>
    );
};