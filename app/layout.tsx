import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "芝麻分凑分 - 三人组队凑2026分",
  description: "智能匹配算法，帮助支付宝用户快速找到合适的队友，三人组队凑2026分。简单、快速、免费。",
  keywords: "芝麻分,凑分,支付宝,2026分,组队,匹配",
  authors: [{ name: "芝麻分凑分" }],
  openGraph: {
    title: "芝麻分凑分 - 三人组队凑2026分",
    description: "智能匹配算法，帮助支付宝用户快速找到合适的队友，三人组队凑2026分",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "芝麻分凑分 - 三人组队凑2026分",
    description: "智能匹配算法，帮助支付宝用户快速找到合适的队友，三人组队凑2026分",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
