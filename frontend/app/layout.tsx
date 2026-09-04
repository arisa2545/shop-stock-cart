import type { Metadata } from "next";
import { Sarabun, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "@/styles/globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Sarabun({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ShopStock — รายการสินค้า",
  description: "รายการสินค้าและสต๊อก",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="site-shell">
          <Navbar />
          <main className="page">{children}</main>
        </div>
      </body>
    </html>
  );
}
