import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'animate.css';
import { Providers } from "./providers";
import ReduxProviderClient from "@/app/redux-provider";
import { Analytics } from "@vercel/analytics/react"
import { LogSnagProvider } from '@logsnag/next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FirebaseAnalytics from "./components/FirebaseAnalytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prototype App",
  description: "Next.js 프로토타입 애플리케이션",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="ko">
      <head>
        <LogSnagProvider
          token={process.env.LOGSNAG_TOKEN || ""}
          project={process.env.LOGSNAG_PROJECT || "prototype"}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
{process.env.CHANNEL_IO_PLUGIN_KEY && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();
                ChannelIO('boot', {
                  "pluginKey": "${process.env.CHANNEL_IO_PLUGIN_KEY}",
                  "hideChannelButtonOnBoot": true,
                  "userId": "${session?.user?.id}"
                });
              `,
            }}
          />
        )}
        <ReduxProviderClient>
          <Providers>
            <Analytics />
            <FirebaseAnalytics />
            {children}
          </Providers>
        </ReduxProviderClient>
      </body>
    </html>
  );
}
