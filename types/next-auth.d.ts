import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        provider?: string;
    }
}

declare module "next-auth/providers" {
    interface AppleProviderOptions {
        clientSecret: string | {
            appleId: string;
            teamId: string;
            privateKey: string;
            keyId: string;
        };
    }
} 