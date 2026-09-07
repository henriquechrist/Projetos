import type { Metadata } from 'next';
import { Cormorant_Garamond, Great_Vibes, Manrope } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ variable: '--font-serif', subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['latin'] });
const script = Great_Vibes({ variable: '--font-script', subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Henrique & Gabriela | Jantar de Noivado',
  description: 'Confirme sua presença no jantar de noivado de Henrique e Gabriela.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`}>{children}</body>
    </html>
  );
}
