import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeInitializer from '../components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EcoSphere - Smart & Sustainable Mobility Platform',
  description: 'A smart and sustainable mobility platform encouraging eco-friendly transportation and community engagement.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeInitializer />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
