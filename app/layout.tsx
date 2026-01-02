import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PaymentConnect',
  description: 'Modern bus ticketing management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}