export const clampValue = (value: number, min: number, max: number) => {
    if (value > max)
        return max;

    if (value < min)
        return min;

    return value;
};
