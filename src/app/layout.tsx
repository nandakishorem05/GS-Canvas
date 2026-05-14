import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CartProvider } from "@/components/providers/cart-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GS Canvas | Your Vision Our Canvas",
  description: "Premium wall décor & custom artwork platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark:selection:bg-primary dark:selection:text-primary-foreground">
        <SmoothScroll>
          <CartProvider>
            {children}
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
