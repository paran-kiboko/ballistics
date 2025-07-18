"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useEffect } from "react";
import Svc from "@/service/Svc";

export default function AuthStatus() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // const extprotectioncd = params.get('extprotectioncd');

        // if (!extprotectioncd || extprotectioncd !== 'SB5thYGtKkrFERskGY4s') {
        //     window.location.href = "/404";
        // }

        if (session) {
            Svc.eventLog('page-main', null, session.user.id, 'page-view');
            console.log('session=========')
            console.log(session);
            console.log('=========')
            // 사용자 정보가 없는경우 사용자 정보 DB 저장 
            fetch('/api/set-user', {
                method: 'POST',
                body: JSON.stringify({
                    userId: session.user.id,
                    username: session?.user?.name,
                    email: session?.user?.email,
                }),
            });
        }
        if (!isLoading && !session) {
            Svc.eventLog('goto-url-login', null, '', '');
            // window.location.href = "/login";
            Svc.gotoURL('/login');
        }
    }, [session]);

    if (isLoading) {
        return <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (!session) {
        return (
            <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    로그인
                </Link>
                <Link
                    href="/signup"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    회원가입
                </Link>
            </div>
        );
    }



    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
                {session.user.email || session.user.name}
            </span>

        </div>
    );
}