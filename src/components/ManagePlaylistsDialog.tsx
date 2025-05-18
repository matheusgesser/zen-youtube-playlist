import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Playlist } from '@/types/Playlist';
import { Trash } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useEffect, useState } from 'react';

type Props = {
    isVisible: boolean,
    closeModal: () => void,
}

export function ManagePlaylistsDialog({ isVisible, closeModal }: Props) {
    const [playlists, setPlaylists] = useState<Playlist.Model[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist.Model['id'] | null>(null);

    const translate = useTranslations();

    useEffect(() => {
        const playlists = Object.values(PlaylistStorage.getAll());

        setPlaylists(playlists);
    }, []);

    const deletePlaylist = (playlistId: Playlist.Model['id']) => {
        PlaylistStorage.remove(playlistId);

        window.location.reload();
    };

    return (
        <Dialog
            visible={isVisible}
            header={translate('manage-playlists')}
            onHide={closeModal}
            draggable={false}
            className="w-[80vw] lg:w-[40rem]"
            dismissableMask
        >
            <div className="flex flex-col gap-4 items-start py-2 truncate">
                <div className="w-full flex flex-col gap-2">
                    {playlists.map(playlist => (
                        <div className="flex gap-0 items-center truncate" key={playlist.id}>
                            <RadioButton
                                inputId={playlist.id}
                                name="pizza"
                                value={playlist.id}
                                onChange={(e) => (e.checked === true ? setSelectedPlaylist(playlist.id) : setSelectedPlaylist(null))}
                                className="hidden"
                            />

                            <label
                                htmlFor={playlist.id}
                                className={`py-0.5 px-2 rounded-md truncate ${selectedPlaylist === playlist.id && 'bg-zinc-900 text-white'}`}
                            >
                                {playlist.title}
                            </label>

                            {selectedPlaylist === playlist.id && (
                                <button
                                    type="button"
                                    onClick={() => deletePlaylist(playlist.id)}
                                    className="p-1 text-red-500"
                                >
                                    <Trash size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    );
}
