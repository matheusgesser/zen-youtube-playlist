import { Link } from '@/i18n/routing';
import { Playlist } from '@/types/Playlist';

type Props = { playlists: Playlist.Model[] }

export function PlaylistList({ playlists }: Props) {
    return (
        <div className="w-full self-start flex flex-col gap-2">
            <span>Stored playlists</span>

            {playlists.map(playlist => (
                <Link href={`/playlist/${playlist.id}`} className="w-full flex items-center justify-between p-2 rounded-md bg-neutral-950">
                    <span className="text-lg">{playlist.id}</span>

                    <span className="px-2 py-0.5">{playlist.videos.length}</span>
                </Link>
            ))}
        </div>
    );
}
