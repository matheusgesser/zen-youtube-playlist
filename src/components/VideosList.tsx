import { Playlist } from '@/types/Playlist';
import { Play } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollPanel } from 'primereact/scrollpanel';
import { useEffect, useRef } from 'react';

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const listElement = containerRef.current?.querySelector<HTMLDivElement>('.p-scrollpanel-content');
        const buttonElement = buttonRefs.current[currentVideoIndex ?? 0];

        if (!listElement || !buttonElement)
            return;

        listElement.scrollTo({
            top: buttonElement.offsetTop - listElement.clientHeight / 2 + buttonElement.clientHeight / 2,
            behavior: 'smooth',
        });
    }, [currentVideoIndex]);

    return (
        <AnimatePresence mode="popLayout">
            {isVisible ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full xl:w-auto flex justify-center"
                >
                    <section ref={containerRef} className="flex flex-col items-center w-full max-w-[min(36rem,100%)] px-4 my-8">
                        <ScrollPanel
                            style={{ width: '100%', maxWidth: '44rem', height: '500px' }}
                            pt={{
                                content: { className: 'flex flex-col gap-2' },
                                barY: { className: 'cursor-default' },
                            }}
                        >
                            {playlistVideos?.map((video, index) => (
                                <button
                                    type="button"
                                    id={`video-${index}`}
                                    onClick={() => setCurrentVideoIndex(index)}
                                    ref={(element) => { buttonRefs.current[index] = element; }}
                                    className={`w-full flex gap-2 px-2 py-1.5 rounded-lg ${index === currentVideoIndex && 'bg-neutral-800'}`}
                                    key={video.originalPosition}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="min-w-8 text-neutral-400 text-end">
                                            {index === currentVideoIndex ? (
                                                <Play size={16} color="white" weight="fill" className="ml-auto" />
                                            ) : (
                                                `${index + 1}.`
                                            )}
                                        </span>

                                        <span className="pr-4 text-start whitespace-nowrap overflow-hidden text-ellipsis">{video.title}</span>
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
