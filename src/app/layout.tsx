import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniTask - 大学課題管理",
  description: "大学生のための課題管理アプリ",
};

import { ClientLayout } from "./client-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
