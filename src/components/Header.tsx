'use client';

import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { GithubLogo, Play } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React from 'react'

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    return (
        <header className="flex items-center justify-between">
            <Link href={{ href: '/' }} className='flex p-2 gap-2 items-center'>
                <Play size={16} />

                <h2 className='mr-auto'>better-youtube-playlist</h2>
            </Link>

            <div className='flex items-center gap-4'>
                <Link href="https://github.com/matheusgesser/better-youtube-playlist" target='_blank'>
                    <div className='p-1.5 bg-white rounded-full'>
                        <GithubLogo size={20} color='black' />
                    </div>
                </Link>
            </div>
        </header>
    )
}
