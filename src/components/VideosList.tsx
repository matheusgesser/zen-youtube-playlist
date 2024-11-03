import { Playlist } from '@/types/Playlist';
import { Play } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dispatch, SetStateAction } from 'react';

type Props = {
    isVisible: boolean,
    playlistVideos: Playlist.Model['videos'] | undefined,
    currentVideoIndex: number | null,
    setCurrentVideoIndex: Dispatch<SetStateAction<number | null>>,
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
                >
                    <section className="px-4 my-8">
                        <ScrollPanel
                            style={{ width: '500px', height: '500px' }}
                            pt={{ content: { className: 'flex flex-col gap-2 pr-3' } }}
                        >
                            {playlistVideos?.map((video, index) => (
                                <button type="button" id={`video-${index}`} onClick={() => setCurrentVideoIndex(index)} className={`w-full flex gap-2 px-2 py-1.5 rounded-lg ${index === currentVideoIndex && 'bg-neutral-800'}`}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-neutral-400">
                                            {index === currentVideoIndex ? (
                                                <Play size={16} color="white" weight="fill" className={currentVideoIndex > 8 ? 'ml-0.5 mr-1' : 'mr-[-0.18rem]'} />
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
