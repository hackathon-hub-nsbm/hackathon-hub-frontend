import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackathon Hub",
  description: "Hackathon Hub Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
