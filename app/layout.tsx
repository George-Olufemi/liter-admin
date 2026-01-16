import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import ReactQueryClientProvider from "@/provider/ReactQueryClientProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "LiteR | Reliable Electricity Vending in Nigeria",
    template: "%s | LiteR",
  },
  description:
    "LiteR is a modern, reliable electricity vending platform for seamless purchase of electricity units in Nigeria. Enjoy fast, direct vending with our independent infrastructure.",
  icons: {
    icon: "/liteR.svg",
    shortcut: "/favliteRicon.svg",
    apple: "/liteR.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <ReactQueryClientProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ReactQueryClientProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
