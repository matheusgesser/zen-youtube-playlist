import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-dark-indigo/theme.css';
import './globals.css';
import { Header } from '@/components/Header';

type Props = {
    children: ReactNode,
    params: {
        locale: 'pt' | 'en',
    }
}

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Better Youtube Playlist',
    description: 'Play Youtube playlists, with a minimalist and better performing interface',
};

export default async function RootLayout({ children, params: { locale } }: Props) {
    return (
        <html lang={locale}>
            <body className={`${poppins.className} antialiased`}>
                <div className="min-h-screen p-4 pb-20 gap-16 sm:py-10 sm:px-20">
                    <main className="flex flex-col gap-8">
                        <Header />

                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
