import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/hooks/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NovaCart",
  description: "Modern E-Commerce Store",
};

export default function RootLayout({ children }) {
  return (
  <html lang="en">
    <body suppressHydrationWarning>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </AuthProvider>
    </body>
  </html>
);
}
