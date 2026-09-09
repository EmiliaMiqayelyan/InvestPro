import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Sans, Noto_Sans_Armenian } from "next/font/google";
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

const armenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-armenian",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} — Investment Marketplace | Ներդրումային շուկա`,
  description:
    "Connect innovative projects with trusted investors. / Կապեք նորարար նախագծերը վստահելի ներդրողների հետ։",
  applicationName: PLATFORM_NAME,
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/brand/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" className="locale-hy">
      <body className={`${sans.variable} ${display.variable} ${armenian.variable} font-sans`}>
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
