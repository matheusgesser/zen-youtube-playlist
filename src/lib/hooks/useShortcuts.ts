import { Dispatch, SetStateAction } from 'react';
import { clampValue } from '../helpers/Utility.helper';

const KEY_CODE = {
    SPACE: 'Space',
    M: 'KeyM',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
} as const;

type KeyCode = typeof KEY_CODE[keyof typeof KEY_CODE];

type Props = {
    setIsPaused: Dispatch<SetStateAction<boolean>>,
    setVolume: Dispatch<SetStateAction<number>>,
    setIsMuted: Dispatch<SetStateAction<boolean>>,
}

const isValidKeyCode = (code: string): code is KeyCode => {
    const validKeyCodes: string[] = Object.values(KEY_CODE);

    return validKeyCodes.includes(code);
};

const clampVolume = (volume: number) => clampValue(volume, 0, 100);

export function useShortcuts({ setIsPaused, setVolume, setIsMuted }: Props) {
    const getActionByKeyCode = (keyCode: KeyCode) => {
        const actions: Record<KeyCode, () => void> = {
            Space: () => setIsPaused(prevState => !prevState),
            ArrowDown: () => setVolume(prevState => clampVolume(prevState - 10)),
            ArrowUp: () => setVolume(prevState => clampVolume(prevState + 10)),
            KeyM: () => setIsMuted(prevState => !prevState),
        };

        return actions[keyCode];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isValidKeyCode(e.code))
            return;

        const action = getActionByKeyCode(e.code);

        action();
    };

    return { handleKeyDown };
}
