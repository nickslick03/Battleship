export type Ship = {
    readonly name: string,
    readonly pointlist: Point[],
    hit(point: Point): boolean,
    isSunk(): boolean,
};

export type Point = {
    x: number,
    y: number,
    isMiss?: boolean,
    isHit?: boolean,
    isSunk?: boolean,
}

export const arePointsEqual = (point1: Point, point2: Point) => point1.x === point2.x && point1.y === point2.y;

export const pointInBounds = ({ x, y }: Point) => x > 0 && x < 11 && y > 0 && y < 11;

export const getStartingPointBoundary = (length: number, isHorizontal: boolean): Point => ({
    x: isHorizontal ? 11 - length : 10,
    y: isHorizontal ? 10 : 11 - length,
});

export const pointlistFactory = (length: number, startingPoint: Point, isHorizontal: boolean): Point[] => 
    Array.from({ length })
    .map((_, index) => ({
        x: isHorizontal ? startingPoint.x + index : startingPoint.x,
        y: isHorizontal ? startingPoint.y : startingPoint.y + index,
    }));

export function shipFactory (name: string, pointList: Point[]): Ship {
    pointList.forEach(point => {
        if((pointInBounds(point) === false)) throw new Error(`point ${point.x}, ${point.y} out of bounds.`);
        point.isHit = false;
        point.isSunk = false;
    });
    return {
        get name() {
            return name;
        },
        get pointlist() {
            return pointList;
        },
        hit(attackPoint) {
            let index = pointList.findIndex(point => arePointsEqual(point, attackPoint));
            if(pointList[index]?.isHit === false) {
                pointList[index].isHit = true;
                if(this.isSunk())
                    pointList.forEach(point => point.isSunk = true);
                return true;
            }
            return false;
        },
        isSunk() {
            return pointList.every(point => point.isHit);  
        },
    };
}
