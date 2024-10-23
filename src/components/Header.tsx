'use client';

import { Link } from '@/i18n/routing';
import { GithubLogo, Play } from '@phosphor-icons/react/dist/ssr';

export function Header() {
    return (
        <header className="flex items-center justify-between">
            <Link href="/" className="flex px-2 py-1 gap-2 items-center rounded-lg hover:bg-neutral-800 byp-transition">
                <Play size={16} />

                <h2 className="mr-auto">better-youtube-playlist</h2>
            </Link>

            <div className="flex items-center gap-4">
                <Link href="https://github.com/matheusgesser/better-youtube-playlist" target="_blank">
                    <div className="p-1.5 bg-white hover:scale-110 rounded-full byp-transition">
                        <GithubLogo size={20} color="black" />
                    </div>
                </Link>
            </div>
        </header>
    );
}
