"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Svc from "@/service/Svc";
import { useTranslation } from "react-i18next";
import '@/i18n';
import i18n from "@/i18n";
import { setAlertMessage, setIsLoading } from "@/store/admin/mainAdmin";
import { useDispatch } from "react-redux";

export default function LoginForm() {
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
    const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false);
    const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const handleGoogleLogin = async () => {

        const isWeb = window.location.hostname === 'localhost' || new URLSearchParams(window.location.search).get('isweb') === 'true';

        if (isWeb) {
            try {
                const result = await signIn("google", {
                    callbackUrl: "/",
                    redirect: false,
                });

                if (result?.error) {
                    console.error("Authentication failed:", result.error);
                } else if (result?.ok) {
                    // user info

                    // window.location.href = result.url || "/dashboard";
                }
            } catch (error) {
                console.error("Login error:", error);
                setIsGoogleLoading(false);
            }
        } else {
            // const nextAuthGoogleUrl = "https://your-next-site.com/api/auth/signin/google";
            // Linking.openURL(nextAuthGoogleUrl);

            dispatch(setIsLoading(true));
            setTimeout(() => {
                dispatch(setIsLoading(false));
            }, 4000);
            Svc.sendMessage({
                type: 'GOOGLE_LOGIN',
            });
        }



    };

    const handleGuestLogin = async () => {
        // Svc.sendMessage({
        //     type: 'GUEST_LOGIN',
        // });
        dispatch(setIsLoading(true));
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 4000);
        Svc.gotoURL('/guest');
    };

    const handleAppleLogin = async () => {
        dispatch(setIsLoading(true));
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 4000);
        // setIsAppleLoading(true);
        try {
            const result = await signIn("apple", {
                callbackUrl: "/",
                redirect: false,
            });

            if (result?.error) {
                console.error("Authentication failed:", result.error);
            } else if (result?.ok) {
                // window.location.href = result.url || "/";
                Svc.gotoURL(result.url || "/");
            }
        } catch (error) {
            console.error("Login error:", error);
            // setIsAppleLoading(false);
        }
    };

    return (
        <div className="py-4 px-4 rounded-[20px] w-full">

            <div className="space-y-3">
                <button
                    onClick={handleAppleLogin}
                    disabled={isAppleLoading || isGoogleLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[30px] shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    {isAppleLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            로그인 중...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 384 512">
                                <path
                                    fill="currentColor"
                                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                                />
                            </svg>
                            {t('loginApple')}
                        </span>
                    )}
                </button>
                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isAppleLoading || isGuestLoading}
                    className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-[30px] shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isGoogleLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            로그인 중...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                />
                            </svg>
                            {t('loginGoogle')}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => {

                        Svc.eventLog('click-pre=guest-login', null, '', 'interaction');

                        Svc.simpleData.alertParams = {
                            title: '',
                            isConfirm: true,
                            confirmText: t('btn1'),
                            callback: (result: boolean) => {
                                if (result) {
                                    handleGuestLogin();
                                }
                            }
                        }

                        dispatch(setAlertMessage(t('alert1')))


                    }}
                    disabled={isGoogleLoading || isAppleLoading || isGuestLoading}
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-[30px] shadow-sm text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        {t('loginGuest')}
                    </span>
                </button>



            </div>
            <div className="language-selector relative mt-8 w-full flex justify-center">
                <select
                    className="appearance-none bg-white px-2 py-1 text-lg text-gray-500 cursor-pointer focus:outline-none relative pr-8 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
                    style={{
                        backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center"
                    }}
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
                    <option value="th">🇹🇭 ภาษาไทย</option>
                    <option value="vi">🇻🇳 Tiếng Việt</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="en">🇺🇸 Etc</option>
                </select>

            </div>
        </div>
    );
}