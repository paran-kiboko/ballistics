import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import SignupForm from "@/app/signup/SignupForm";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    // 이미 로그인한 사용자는 대시보드로 리디렉션
    if (session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        새 계정 만들기
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Google 계정으로 빠르게 가입하세요
                    </p>
                </div>

                <SignupForm />
            </div>
        </div>
    );
}