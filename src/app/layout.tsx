import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/convex-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Timer X2 - Foco, Respiração e Alquimia do Tempo",
  description: "Transforme seu foco com o Timer X2. Uma experiência fluida, centrada e emocionalmente equilibrada para meditação, respiração e produtividade consciente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#2ECC71" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased tracking-wide`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
