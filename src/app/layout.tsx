import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Backoffice Hub | 통합 업무 관리 플랫폼",
  description:
    "혜움, 비즈플레이, 홈택스 등 다양한 SaaS 시스템을 통합 관리하고, 마감 기반 업무 자동화를 제공하는 통합 ERP 시스템",
  keywords: [
    "ERP",
    "백오피스",
    "업무자동화",
    "마감관리",
    "급여관리",
    "세무",
    "회계",
    "4대보험",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/signup"}
      appearance={{
        variables: {
          colorPrimary: "#4f46e5",
        },
      }}
    >
      <html lang="ko" suppressHydrationWarning>
        <head>
          <link
            rel="preload"
            href="/fonts/PretendardVariable.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </head>
        <body className="bg-gray-1">
          <Providers>{children}</Providers>
          <Toaster
            position="top-center"
            expand={true}
            toastOptions={{
              style: {
                left: "50%",
                transform: "translateX(-50%)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
