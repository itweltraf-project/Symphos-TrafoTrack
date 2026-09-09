import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ShipmentProvider } from '@/context/ShipmentContext';

export const metadata: Metadata = {
  title: 'TRANSFORMER DELIVERY TRACKING — End-to-End Transformer Shipment Monitoring System',
  description: 'Industrial SaaS Dashboard untuk monitoring pengiriman Transformer / Trafo dari pabrik ke customer via 10 vendor ekspedisi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-100 text-slate-900 selection:bg-blue-500 selection:text-white">
        <AuthProvider>
          <ShipmentProvider>{children}</ShipmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
