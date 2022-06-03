export type Ship = {
    readonly name: string,
    readonly length: number,
    hit(): number,
    isSunk(): boolean,
};

export const shipFactory = (name: string, length: number): Ship => {
    let hitCount = 0;
    return {
        get name() {
            return name;
        },
        get length() {
            return length;
        },
        hit: () => hitCount++,
        isSunk: () => hitCount === length,
    };
};