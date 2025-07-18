"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoginForm from "@/app/login/LoginForm";
import dynamic from "next/dynamic";
import Logo from "@/components/Logo";
import Svc from "@/service/Svc";
import { setAppVersion, setSafeArea } from "@/store/admin/mainAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import '@/i18n';
import { RootState } from "@/store";
import i18n from "@/i18n";
import LanguageDetector from 'i18next-browser-languagedetector';
import classNames from "classnames";
import CommonComp from "../common/CommonComp";
// LanguageSelector를 클라이언트 컴포넌트로 로드
// const LanguageSelector = dynamic(
//     () => import("@/components/ui/LanguageSelector"),
//     { ssr: false }
// );

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const safeArea = useSelector((state: RootState) => state.main.safeArea);
    const appVersion = useSelector((state: RootState) => state.main.appVersion);
    useEffect(() => {
        Svc.init(window);
        const params = new URLSearchParams(window.location.search);
        const topSafeArea = params.get('topSafeArea');
        const bottomSafeArea = params.get('bottomSafeArea');
        dispatch(setSafeArea({
            top: Number(topSafeArea) || 0,
            bottom: Number(bottomSafeArea) || 0
        }));

        Svc.sendMessage({
            type: 'DEVICE_INFO',
            callback: (data: any) => {

                dispatch(setSafeArea({
                    top: data.safeArea.top,
                    bottom: data.safeArea.bottom
                }));
                dispatch(setAppVersion(data.appVersion));
            }
        });
    }, []);
    useEffect(() => {

        // 이미 로그인한 사용자는 대시보드로 리디렉션
        if (session) {
            Svc.setUserId(session?.user?.id);
            router.push("/");
        } else if (status !== "loading") {
            setIsLoading(false);

            // const ld = new LanguageDetector();
            // const _languageDetector = ld.detect();
            // const _languageCode = _languageDetector;
            // // alert('languageCode::4' + _languageCode)
            // i18n.changeLanguage(Array.isArray(_languageCode) ? _languageCode[0] : _languageCode);
            // Svc.sendMessage({
            //     type: 'SET_STORAGE_DATA_WITH_KEY',
            //     data: {
            //         key: 'languageCode',
            //         value: _languageCode
            //     }
            // })
            initLanguageCode();

        }
    }, [session, status, router]);

    const initLanguageCode = () => {

        // 우선 순위 
        // 1. 스토리지 저장 값
        // 2. 파라미터 값
        // 3. 기본 값
        const params = new URLSearchParams(window.location.search);
        // 2. 파라미터 값
        const languageCodeParam = params.get('languageCode');
        // 3. 기본 값
        const ld = new LanguageDetector();
        const _languageDetector = ld.detect();

        Svc.sendMessage({
            type: 'GET_STORAGE_DATA_WITH_KEY',
            callback: (res: any) => {
                let storageLanguageCode = null;

                if (res && typeof res === "object") {
                    storageLanguageCode = res.value;
                } else {
                    storageLanguageCode = res;
                }

                const _languageCode = storageLanguageCode || languageCodeParam || _languageDetector;
                i18n.changeLanguage(Array.isArray(_languageCode) ? _languageCode[0] : _languageCode);
                Svc.sendMessage({
                    type: 'SET_STORAGE_DATA_WITH_KEY',
                    data: {
                        key: 'languageCode',
                        value: _languageCode
                    }
                })

            },
            data: { key: 'languageCode' }
        })

    }

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (appVersion === '' && process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <>
            <div className={classNames([
                "flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white logid-loginPageContainer",

            ])}>
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white/30 backdrop-blur-xl logid-loginPageBackground"></div>

                <div className="w-full max-w-md space-y-8 z-10 h-[90vh] relative flex flex-col justify-center logid-loginFormContainer">
                    <div className="text-center flex flex-col items-center logid-loginHeaderContainer">


                    </div>

                    <LoginForm />

                </div>
            </div>
            <CommonComp />
        </>
    );
}