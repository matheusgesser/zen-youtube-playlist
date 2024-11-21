'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';

const AudioPlayerContextDefaultValues = {
    progress: 0,
    setProgress: () => {},

    isPaused: false,
    setIsPaused: () => {},

    volume: 0,
    setVolume: () => {},
    isMuted: false,
    setIsMuted: () => {},
};

type AudioPlayerContextType = {
    progress: number,
    setProgress: Dispatch<SetStateAction<number>>,

    isPaused: boolean,
    setIsPaused: Dispatch<SetStateAction<boolean>>,

    volume: number,
    setVolume: Dispatch<SetStateAction<number>>,
    isMuted: boolean,
    setIsMuted: Dispatch<SetStateAction<boolean>>,
};

type Props = { children: ReactNode };

const AudioPlayerContext = createContext<AudioPlayerContextType>(AudioPlayerContextDefaultValues);

function AudioPlayerProvider({ children }: Props) {
    const [progress, setProgress] = useState(0);

    const [isPaused, setIsPaused] = useState(false);

    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const value: AudioPlayerContextType = {
        progress,
        setProgress,

        isPaused,
        setIsPaused,

        volume,
        setVolume,
        isMuted,
        setIsMuted,
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

const useAudioPlayer = () => useContext(AudioPlayerContext);

export { AudioPlayerProvider, useAudioPlayer };
