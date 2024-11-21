import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

import 'primereact/resources/themes/tailwind-light/theme.css';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type Props = {
    children: ReactNode,
    params: {
        locale: 'pt' | 'en',
    }
}

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Zen Youtube Playlist',
    description: 'Minimalist player, offering a distraction-free way to enjoy your playlists',
};

export default async function RootLayout({ children, params: { locale } }: Props) {
    return (
        <html lang={locale}>
            <body className={`${poppins.className} antialiased`}>
                <div className="min-h-screen p-4 flex flex-col gap-2 pb-20 sm:py-10 sm:px-20">
                    <Header />

                    <main className="flex flex-col mt-10">
                        {children}
                    </main>

                    <Footer />
                </div>
            </body>
        </html>
    );
}
