import { Skeleton } from 'primereact/skeleton';

export function AudioPlayerSkeleton() {
    return (
        <>
            <div className="max-w-[28rem] min-h-24 grid place-items-center">
                <Skeleton width="22rem" className="-mb-[2.5rem]" />
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
        </>
    );
}
