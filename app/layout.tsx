import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecondChance | Local Community Marketplace",
  description: "Buy, sell, or giveaway items and vehicles in your neighborhood. Give your gently used items a second chance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
