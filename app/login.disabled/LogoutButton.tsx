"use client";

import Svc from "@/service/Svc";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogout = async () => {

        setIsLoading(true);
        try {
            // Check if it's running on localhost or has isweb=true in query parameters
            const isWeb = window.location.hostname === 'localhost' || new URLSearchParams(window.location.search).get('isweb') === 'true';

            if (isWeb) {
                await signOut({ callbackUrl: "/" });
            } else {
                Svc.sendMessage({
                    type: 'LOGOUT',
                    callback: async () => {

                        await signOut({ callbackUrl: "/login" });
                    }
                });
            }


        } catch (error) {
            console.error("Logout error:", error);
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-sm font-medium text-gray-400 hover:text-gray-400"
        >
            {isLoading ? "Logging out..." : "Logout"}
        </button>
    );
}