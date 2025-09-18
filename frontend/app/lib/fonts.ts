// lib/fonts.ts
import { Geist, Geist_Mono, Poppins } from 'next/font/google';

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--app-font-geist-sans',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--app-font-geist-mono',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--app-font-poppins', // <-- our app var
});
