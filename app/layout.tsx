import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestPro - Premium Investment Platform",
  description: "Modern investment platform for managing portfolios, crypto, and projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              theme="dark"
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(0 0% 7%)",
                  border: "1px solid hsl(0 0% 18%)",
                  color: "hsl(0 0% 98%)",
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
