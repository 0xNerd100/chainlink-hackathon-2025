import { Metadata } from "next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/globals.css";
import { ThemeProvider } from "@/ContextApi/ThemeContext";

import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
// import { headers } from "next/headers";
import { Poppins } from "next/font/google";
import { headers } from "next/headers";
import NetworkSwitcher from "@/components/common/NetworkSwitcher";
import Header from "@/components/header";
import ContextProvider from "@/context";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional: adjust weights as needed
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lendr.fi",
  description: "Lendr.fi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = await headers();
  const cookies = cookieHeader.get("cookie");
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/fav.png?v=2" />
      </head>
      <body>
        <div className={` ${poppins.className}`}>
          <ToastContainer />
          <ThemeProvider>
            <ContextProvider cookies={cookies}>
              <Header />
              {children}
            </ContextProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
