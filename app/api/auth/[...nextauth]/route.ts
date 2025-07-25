// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
// import { createClient } from "@supabase/supabase-js";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import jwt from "jsonwebtoken";
import { SignJWT } from "jose";
import { createPrivateKey } from "crypto";

// Add type declaration for Session with accessToken
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }

    interface User {
        token?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        accessToken?: string;
    }
}

// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

async function getAppleClientSecret() {
    const key = `-----BEGIN PRIVATE KEY-----\n${process.env.APPLE_PRIVATE_KEY}\n-----END PRIVATE KEY-----`;
    return await new SignJWT({})
        .setProtectedHeader({
            alg: "ES256",
            kid: process.env.APPLE_KEY_ID,
        })
        .setIssuer(process.env.APPLE_TEAM_ID!)
        .setSubject(process.env.APPLE_CLIENT_ID!)
        .setAudience("https://appleid.apple.com")
        .setIssuedAt(Math.floor(Date.now() / 1000))
        .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 2)
        .sign(createPrivateKey(key));
}



// Create a handler function that dynamically configures NextAuth
const handler = async (req: any, res: any) => {
    return await NextAuth(req, res, {
        debug: false,
        secret: process.env.NEXTAUTH_SECRET,
        providers: [
            ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                })
            ] : []),
            // AppleProvider({
            //     clientId: process.env.APPLE_ID!,          // 반드시 Service ID
            //     clientSecret: await getAppleClientSecret(),       // ES256 JWT
            //     checks: ["pkce"],                                 // v4/v5 모두 권장
            //     token: { url: "https://appleid.apple.com/auth/token" },
            //     client: { token_endpoint_auth_method: "client_secret_post" },

            //     authorization: {
            //         url: "https://appleid.apple.com/auth/authorize",
            //         params: {
            //             response_type: "code id_token",               // ★ id_token 확보
            //             response_mode: "form_post",
            //             scope: "name email",                          // openid 제거
            //         },
            //     },

            //     // Apple은 이름·이메일을 첫 로그인에만 form-post로 줌 → 보정
            //     profile(profile, tokens) {
            //         // profile.sub, profile.email 은 정상적으로 들어옴
            //         return { id: profile.sub, email: profile.email, name: null };
            //     },
            // }),
            CredentialsProvider({
                name: "CustomGoogle",
                credentials: {
                    token: { label: "Token", type: "text" }
                },
                async authorize(credentials) {
                    const token = credentials?.token;
                    if (token) {
                        try {
                            // 토큰에서 사용자 정보 추출
                            const decoded = jwt.decode(token);
                            console.log('tag-d authorize', decoded);
                            if (decoded && typeof decoded !== 'string') {
                                // sub 필드가 Google 사용자의 고유 ID
                                const userId = decoded.sub as string;
                                const email = decoded.email as string;
                                const name = decoded.name as string;
                                const image = decoded.picture as string;

                                return {
                                    id: userId,
                                    email,
                                    name,
                                    image,
                                    token
                                };
                            }
                        } catch (error) {
                            console.error("Error decoding token:", error);
                        }
                        // 디코딩 실패 시 기본값 사용
                        // return { id: "google-user", token };
                    }
                    return null;
                }
            })
        ],
        cookies: {
            pkceCodeVerifier: {
                name:
                    process.env.NODE_ENV === "production"
                        ? "__Secure-next-auth.pkce.code_verifier"
                        : "next-auth.pkce.code_verifier",
                options: {
                    httpOnly: true,
                    sameSite: "none",   // ★ 핵심
                    secure: true,     // SameSite=None 사용 시 필수
                    path: "/",
                },
            },
        },
        callbacks: {
            // async redirect({ url, baseUrl }) {
            //     // 로그인 성공 후 앱으로 리디렉트
            //     return 'renoapp://callback';
            // },
            async session({ session, token }) {
                console.log('tag-a session', session, token);
                if (session?.user) {
                    session.user.id = token.sub!;
                }
                session.accessToken = token.accessToken;

                return session;
            },
            async jwt({ token, account, user }) {
                console.log('tag-b jwt', token, account, user);
                if (user) {
                    token.userId = user.id;
                }
                if (account) {
                    token.accessToken = account.access_token;
                }
                return token;
            },
            async signIn({ user, account, profile }) {
                console.log('tag-c signIn', user, account, profile);

                let userProfile = profile;
                if (!userProfile && user.token) {
                    try {
                        // 토큰 디코딩 (JWT 검증 없이 페이로드만 추출)
                        const decoded = jwt.decode(user.token);
                        if (decoded && typeof decoded !== 'string') {
                            userProfile = {
                                // Profile 타입에 맞게 속성 설정
                                email: decoded.email as string,
                                name: decoded.name as string,
                                image: decoded.picture as string
                            };
                        }
                    } catch (error) {
                        console.error("Error decoding token:", error);
                    }
                }

                if (!user.email && userProfile?.email) {
                    user.email = userProfile.email;
                }

                if (!user.email) return false;

                // Skip Supabase sync for now
                console.log("Supabase sync skipped - not configured");
                return true;
                
                // try {
                //     // NextAuth의 user.id를 Supabase의 user_id에 저장하는 대신,
                //     // 별도의 필드(예: oauth_id)에 저장하거나
                //     // Supabase가 자동으로 생성한 UUID를 사용
                //     const { data, error } = await supabase
                //         .from("users")
                //         .upsert({
                //             // user_id는 생략하여 Supabase가 자동 생성하도록 함
                //             username: user.name || user.email.split("@")[0],
                //             email: user.email,
                //             updated_at: new Date().toISOString(),
                //             // Google에서 제공하는 ID를 별도 필드에 저장 (선택사항)
                //             // oauth_id: user.id
                //         }, {
                //             onConflict: 'email', // user_id 대신 email을 기준으로 충돌 처리
                //             ignoreDuplicates: false,
                //         })
                //         .select();

                //     if (error) {
                //         console.error("Error syncing user to Supabase:", error);
                //         return true;
                //     }

                //     return true;
                // } catch (error) {
                //     console.error("SignIn error:", error);
                //     return true;
                // }
            },

        },
        pages: {
            signIn: "/login",
            newUser: "/signup/complete",
        },
    });
};

export { handler as GET, handler as POST };