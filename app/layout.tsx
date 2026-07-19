import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym Hero",
  description: "Manage your gym athletes easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased font-sans bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
