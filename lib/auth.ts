import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

// 서버 컴포넌트에서 현재 세션 가져오기
export async function getSession() {
    return await getServerSession(authOptions);
}

// 인증된 사용자만 접근 가능한 페이지를 위한 함수
export async function requireAuth() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}