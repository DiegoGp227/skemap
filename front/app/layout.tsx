import "../style/globals.css";
import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { SWRProvider } from "@/provider/StoreProvider";
import Header from "./components/molecules/Header";

const assistant = Assistant({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skemap",
  description: "Skemap App",
  icons: {
    icon: "/skemap_icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${assistant.variable} antialiased  w-full min-h-screen flex flex-col bg-base text-fg`}
      >
        <SWRProvider>
          <Header />
          <div className="max-w-screen-2xl mx-auto flex-1 w-full">
            {children}
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}
