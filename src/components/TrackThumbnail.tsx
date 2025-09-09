import { CSSProperties } from 'react';

type Props = {
  thumbnailUrl?: string;
  isPaused: boolean;
};

export function TrackThumbnail({ thumbnailUrl, isPaused }: Props) {
    const baseStyles: CSSProperties = {
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    };

    const thumbnailStyles: CSSProperties = {
        ...baseStyles,
        backgroundSize: '180% 140%',
        animation: `spin 30s linear infinite ${isPaused ? 'paused' : 'running'}`,
        transition: 'transform 2s linear',
    };

    return (
        <div className="relative size-[12rem] overflow-visible">
            <div
                className="absolute inset-[-1rem] rounded-full blur-3xl opacity-50 -z-10"
                style={baseStyles}
            />

            <div
                className="size-full rounded-full"
                style={thumbnailStyles}
            />
        </div>
    );
}
