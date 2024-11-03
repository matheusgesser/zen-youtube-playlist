import { Link } from '@/i18n/routing';
import { Playlist } from '@/types/Playlist';
import { Lock, LinkSimple, Globe } from '@phosphor-icons/react/dist/ssr';

type Props = { playlists: Playlist.Model[] }

const makePrivacyIcon = (privacyStatus: Playlist.Model['privacyStatus']) => {
    if (privacyStatus === 'private')
        return <Lock size={14} className="text-neutral-500" />;

    if (privacyStatus === 'unlisted')
        return <LinkSimple size={14} className="text-neutral-500" />;

    return <Globe size={14} className="text-neutral-500" />;
};

export function PlaylistList({ playlists }: Props) {
    return (
        <div className="w-full self-start flex flex-col gap-2">
            <span>Stored playlists</span>

            {playlists.map(playlist => (
                <Link href={`/playlist/${playlist.id}`} className="w-full flex items-center p-2 rounded-md bg-neutral-950">
                    <div className="flex items-center gap-1">
                        <span className="text-lg">{playlist.title}</span>

                        {makePrivacyIcon(playlist.privacyStatus)}
                    </div>

                    <span className="px-2 py-0.5 ml-auto">{playlist.videos.length}</span>
                </Link>
            ))}
        </div>
    );
}
