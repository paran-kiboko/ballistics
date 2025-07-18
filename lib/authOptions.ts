import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { createClient } from "@supabase/supabase-js";

// Supabase client - only initialize if configuration is available
let supabase: any = null;

if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') &&
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 10) {
    try {
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    } catch (error) {
        console.warn('Failed to initialize Supabase client:', error);
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        ...(process.env.APPLE_ID && process.env.APPLE_PRIVATE_KEY_BASE64 ? [
            AppleProvider({
                clientId: process.env.APPLE_ID,
                clientSecret: Buffer.from(process.env.APPLE_PRIVATE_KEY_BASE64, 'base64').toString(),
                // Apple은 JWT 토큰을 사용하기 때문에 추가 설정이 필요
                authorization: {
                    params: {
                        scope: "name email",
                        response_mode: "form_post",
                    },
                },
            })
        ] : [])
    ],
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },
        async signIn({ user, account, profile }) {

            if (!user.email) return false;
            console.log("user::::::::", user);
            console.log("account::::::::", account);
            console.log("profile::::::::", profile);
            
            // Skip Supabase sync if not configured
            if (!supabase) {
                console.warn("Supabase not configured, skipping user sync");
                return true;
            }
            
            try {
                // Supabase에 사용자 정보 동기화
                const { data, error } = await supabase
                    .from("users")
                    .upsert({
                        user_id: user.id,
                        username: user.name || user.email.split("@")[0],
                        email: user.email,
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'user_id',
                        ignoreDuplicates: false,
                    })
                    .select();

                if (error) {
                    console.error("Error syncing user:", error);
                    return false;
                }

                return true;
            } catch (error) {
                console.error("SignIn error:", error);
                return false;
            }
        },
    },
    pages: {
        signIn: "/login",
        newUser: "/signup/complete",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30일
    },
};