import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { PLATFORM_NAME } from "@/constants";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} / Investment Marketplace`,
  description:
    "XS Invest helps investors and project owners discover each other and explore possible collaboration.",
  applicationName: PLATFORM_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="locale-en">
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        <QueryProvider>
          <LocaleProvider>
            <AuthProvider>
              {children}
              <Toaster
                theme="light"
                position="top-right"
                toastOptions={{
                  classNames: {
                    toast: "border border-border bg-card text-foreground shadow-soft",
                  },
                }}
              />
            </AuthProvider>
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
