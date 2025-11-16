import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: "Mystical Vacations - Luxury Travel to Kenya & Tanzania",
  description: "Experience the mystical luxury of East Africa. Curated journeys through Kenya and Tanzania's most breathtaking destinations.",
  keywords: ["luxury travel", "Kenya", "Tanzania", "safari", "Zanzibar", "Serengeti", "Maasai Mara"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

