'use client';

import { Link } from '@/i18n/routing';
import { GithubLogo, Play } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

export function Header() {
    return (
        <header className="flex items-center justify-between">
            <Link href="/" className='flex p-2 gap-2 items-center'>
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
