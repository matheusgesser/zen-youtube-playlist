import { Playlist } from '@/types/Playlist';
import { Play } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollPanel } from 'primereact/scrollpanel';

type Props = {
    isVisible: boolean,
    playlistVideos: Playlist.Model['videos'] | undefined,
    currentVideoIndex: number | null,
    setCurrentVideoIndex: (videoIndex: number) => void,
}

export function VideosList({
    isVisible,
    playlistVideos,
    currentVideoIndex,
    setCurrentVideoIndex,
}: Props) {
    return (
        <AnimatePresence mode="popLayout">
            {isVisible ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full xl:w-auto flex justify-center"
                >
                    <section className="w-full max-w-[32rem] px-4 my-8">
                        <ScrollPanel
                            style={{ width: '100%', maxWidth: '44rem', height: '500px' }}
                            pt={{
                                content: { className: 'flex flex-col gap-2 pr-3' },
                                barY: { className: 'cursor-default' },
                            }}
                        >
                            {playlistVideos?.map((video, index) => (
                                <button
                                    type="button"
                                    id={`video-${index}`}
                                    onClick={() => setCurrentVideoIndex(index)}
                                    key={video.id}
                                    className={`w-full flex gap-2 px-2 py-1.5 rounded-lg ${index === currentVideoIndex && 'bg-neutral-800'}`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="min-w-6 text-neutral-400">
                                            {index === currentVideoIndex ? (
                                                <Play size={16} color="white" weight="fill" />
                                            ) : (
                                                `${index + 1}.`
                                            )}
                                        </span>

                                        <span className="text-start whitespace-nowrap overflow-hidden text-ellipsis">{video.title}</span>
                                    </div>
                                </button>
                            ))}
                        </ScrollPanel>
                    </section>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
