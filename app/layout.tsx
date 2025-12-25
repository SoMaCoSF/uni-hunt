import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unicorn Hunt",
  description: "Catch unicorns, defend your gold, survive the leprechauns!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
