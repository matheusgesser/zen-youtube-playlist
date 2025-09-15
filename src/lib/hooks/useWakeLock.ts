import { useRef, useCallback } from 'react';

export function useWakeLock() {
    // eslint-disable-next-line no-undef
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const request = useCallback(async () => {
        if ('wakeLock' in navigator) {
            wakeLockRef.current = await navigator.wakeLock.request('screen');

            // Re-acquire if the tab becomes visible again
            document.addEventListener('visibilitychange', async () => {
                if (document.visibilityState === 'visible' && wakeLockRef.current === null)
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
            });
        }
    }, []);

    const release = useCallback(async () => {
        await wakeLockRef.current?.release();

        wakeLockRef.current = null;
    }, []);

    return { request, release };
}
