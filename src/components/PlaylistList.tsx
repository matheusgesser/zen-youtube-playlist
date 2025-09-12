import { Link } from '@/i18n/routing';
import { Playlist } from '@/types/Playlist';
import { Lock, LinkSimple, Globe } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';

type Props = {
    label: string,
    playlists: Playlist.Model[],
};

/** @factory */
const makePrivacyIcon = (privacyStatus: Playlist.Model['privacyStatus']) => {
    if (privacyStatus === 'private')
        return <Lock size={14} className="text-neutral-500" />;

    if (privacyStatus === 'unlisted')
        return <LinkSimple size={14} className="text-neutral-500" />;

    if (privacyStatus === 'public')
        return <Globe size={14} className="text-neutral-500" />;

    return null;
};

export function PlaylistList({ label, playlists }: Props) {
    const translate = useTranslations();

    /** @factory */
    const makePrivacyLabel = (privacyStatus: Playlist.Model['privacyStatus']) => {
        if (privacyStatus === 'private')
            return translate('private');

        if (privacyStatus === 'unlisted')
            return translate('unlisted');

        if (privacyStatus === 'public')
            return translate('public');

        return undefined;
    };

    return (
        <div className="w-full self-start flex flex-col gap-2">
            <span>{label}</span>

            {playlists.map(playlist => (
                <Link href={`/playlist/${playlist.id}`} className="w-full flex items-center p-2 rounded-md bg-neutral-950">
                    <div className="flex items-center gap-1">
                        <span className="text-lg">{playlist.title ?? playlist.id}</span>

                        <div title={makePrivacyLabel(playlist.privacyStatus)}>
                            {makePrivacyIcon(playlist.privacyStatus)}
                        </div>
                    </div>

                    <span className="px-2 py-0.5 ml-auto">{playlist.videos.length}</span>
                </Link>
            ))}
        </div>
    );
}
