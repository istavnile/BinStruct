import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BinStruct",
  description: "Crea, organiza y exporta estructuras de carpetas para producción audiovisual y proyectos creativos. Templates reutilizables, exportación a ZIP y disco.",
  openGraph: {
    title: "BinStruct — Template Manager",
    description: "Crea, organiza y exporta estructuras de carpetas para producción audiovisual y proyectos creativos.",
    siteName: "BinStruct",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BinStruct — Template Manager",
    description: "Crea, organiza y exporta estructuras de carpetas para producción audiovisual y proyectos creativos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
