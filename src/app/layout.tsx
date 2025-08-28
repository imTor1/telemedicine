import "./globals.css";
import type { Metadata } from "next";
import { SPAProvider } from "../app/context/SPAContext";

export const metadata: Metadata = {
  title: "MediCare — Telemedicine",
  description: "ค้นหาแพทย์ จองนัด และดูนัดหมายแบบออนไลน์",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-white text-gray-900">
        <SPAProvider>{children}</SPAProvider>
      </body>
    </html>
  );
}
