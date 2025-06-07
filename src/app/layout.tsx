import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '../contexts/CartContext';
import Footer from '../components/Footer';
import Header from '../components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Atypic Cactus - Spécialiste Cactus et Plantes Grasses",
  description: "Découvrez notre collection de cactus et plantes grasses exceptionnels. Pépinière professionnelle dans le Roussillon depuis 10 ans.",
  keywords: "cactus, plantes grasses, pépinière, Roussillon, Vincent Basset, aménagement jardin",
  openGraph: {
    title: "Atypic Cactus - Spécialiste Cactus et Plantes Grasses",
    description: "Découvrez notre collection de cactus et plantes grasses exceptionnels",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Optimisations de performance - Preconnect et DNS prefetch */}
        <link rel="preconnect" href="https://www.atypic-cactus.com" />
        <link rel="dns-prefetch" href="https://www.atypic-cactus.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta optimisations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/Majestic Cactus Close-Up.mp4" as="video" type="video/mp4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch {}
            `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <div className="flex flex-col min-h-screen" suppressHydrationWarning>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
