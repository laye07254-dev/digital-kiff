import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Digital Kiff — Studio de Design & Objets",
  description: "Digital Kiff explore la frontière entre le physique et le numérique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
