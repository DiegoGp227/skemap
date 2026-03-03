import "../style/globals.css";
import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { SWRProvider } from "@/provider/StoreProvider";

const assistant = Assistant({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skemap",
  description: "Skemap App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${assistant.variable} antialiased bg-main-gray w-full min-h-screen flex flex-col`}
      >
        <SWRProvider>
          <div className="max-w-screen-2xl mx-auto flex-1 w-full">
            {children}
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}
