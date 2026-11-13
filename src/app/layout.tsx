import type { Metadata } from "next";
import { Lora, Nunito } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Juego de los Fragmentos",
  description: "Una serie de acertijos, pistas y códigos te llevarán a descubrir un mensaje oculto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${lora.variable} ${nunito.variable} min-h-screen bg-[#F5F1E3] text-[#2C352D] antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
