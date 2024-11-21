'use client';

import { Link, useRouter } from '@/i18n/routing';
import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Gear, Play } from '@phosphor-icons/react/dist/ssr';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRef, useState } from 'react';

export function Header() {
    const [isConfirmClearDataDialogVisible, setIsConfirmClearDataDialogVisible] = useState(false);

    const menuRight = useRef<Menu>(null);

    const router = useRouter();

    const clearStoredData = () => {
        PlaylistStorage.clear();

        router.push('/');

        window.location.reload();
    };

    const items: MenuItem[] = [
        {
            label: 'Clear stored data',
            command: () => setIsConfirmClearDataDialogVisible(true),
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

            <ConfirmDialog
                group="declarative"
                visible={isConfirmClearDataDialogVisible}
                onHide={() => setIsConfirmClearDataDialogVisible(false)}
                header="Warning"
                message="Are you sure you want to clear all stored data?"
                draggable={false}
                dismissableMask
                pt={{
                    message: { className: 'm-0' },
                    footer: { className: 'flex justify-end items-center gap-2' },
                    rejectButton: { className: 'px-3 py-1' },
                    acceptButton: { className: 'px-3 py-1 bg-black text-white' },
                }}
                accept={clearStoredData}
                reject={() => setIsConfirmClearDataDialogVisible(false)}
            />
        </header>
    );
}
