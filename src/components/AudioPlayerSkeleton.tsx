import { Skeleton } from 'primereact/skeleton';

export function AudioPlayerSkeleton() {
    return (
        <div className="w-full flex flex-col gap-6 items-center">
            <div className="w-full h-[56px] flex flex-col items-center justify-end gap-2">
                <Skeleton width="20rem" />
                <Skeleton width="24rem" />
            </div>

            <Skeleton shape="circle" size="12rem" />

            <Skeleton width="16rem" height="0.6rem" />

            <div className="flex gap-5 items-center">
                <Skeleton width="1rem" />
                <Skeleton shape="circle" size="1.5rem" />
                <Skeleton shape="circle" size="3rem" />
                <Skeleton shape="circle" size="1.5rem" />
                <Skeleton width="1rem" />
            </div>

            <div className="flex gap-2 items-center">
                <Skeleton shape="circle" size="1.25rem" />
                <Skeleton width="8rem" height="0.6rem" />
            </div>
        </div>
    );
}
