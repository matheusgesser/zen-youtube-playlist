import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

import 'primereact/resources/themes/tailwind-light/theme.css';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${poppins.className} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <div className="min-h-screen p-4 flex flex-col gap-2 pb-20 sm:py-10 sm:px-20">
                        <Header />

                        <main className="flex flex-col mt-10">
                            {children}
                        </main>

                        <Footer />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
