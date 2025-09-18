// app/layout.tsx
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { RoleGuard } from './_guards/role-guard';
import { geistSans, geistMono, poppins } from './lib/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <Toaster position='bottom-right' />
        <RoleGuard>{children}</RoleGuard>
      </body>
    </html>
  );
}
