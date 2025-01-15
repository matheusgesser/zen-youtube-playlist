'use client';

import { Link } from '@/i18n/routing';
import { Gear, Play } from '@phosphor-icons/react/dist/ssr';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ManagePlaylistsDialog } from './ManagePlaylistsDialog';

export function Header() {
    const [isManagePlaylistsDialogVisible, setIsManagePlaylistsDialogVisible] = useState(false);

    const menuRight = useRef<Menu>(null);

    const translate = useTranslations();

    const items: MenuItem[] = [
        {
            label: translate('manage-playlists'),
            command: () => setIsManagePlaylistsDialogVisible(true),
        },
    ];

    return (
        <header className="flex items-center">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex px-2 py-1 gap-2 items-center rounded-lg hover:bg-neutral-800 byp-transition">
                    <Play size={16} />

                    <h2 className="mr-auto">zen-youtube-playlist</h2>
                </Link>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button
                    type="button"
                    onClick={(e) => menuRight.current!.toggle(e)}
                    className="p-0.5 rounded-full"
                    aria-controls="popup_menu"
                    aria-haspopup
                >
                    <Gear size={26} color="white" />
                </button>
            </div>
            <Menu model={items} popup ref={menuRight} id="popup_menu" popupAlignment="right" />

            <ManagePlaylistsDialog
                isVisible={isManagePlaylistsDialogVisible}
                closeModal={() => setIsManagePlaylistsDialogVisible(false)}
                key={isManagePlaylistsDialogVisible.toString()}
            />
        </header>
    );
}
