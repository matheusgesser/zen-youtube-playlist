'use client';

import { Link } from '@/i18n/routing';
import { GithubLogo } from '@phosphor-icons/react';

export function Footer() {
    return (
        <footer className="mt-auto self-end">
            <Link href="https://github.com/matheusgesser/better-youtube-playlist" target="_blank">
                <div className="p-1.5 bg-white hover:scale-110 rounded-full byp-transition">
                    <GithubLogo size={20} color="black" />
                </div>
            </Link>
        </footer>
    );
}
