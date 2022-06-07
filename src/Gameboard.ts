import { Ship } from './Ship';

export type Gameboard = {
    shipInfoList: ShipInfo[],
    attackList: Point[],
    placeShip(ship: Ship, startingPoint: Point, isHorizontal: boolean): void,
    receiveAttack(attackPoint: Point): AttackMessage,
    getShipOnPoint(point: Point): ShipInfo | false,
    getShipPoints({location: {point1, point2}}: ShipInfo): Point[],
    isAllSunk(): boolean,
};

export type ShipInfo = {
    ship: Ship,
    location: Location,
    isHorizontal: boolean,
};

type Location = {
    point1: Point,
    point2: Point,
};

export type Point = {
    'x': number,
    'y': number,
};

export type AttackMessage = {
    isHit: Point | false;
    isSunk: Ship | false;
    isAllSunken: boolean;
};

export const arePointsEqual = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): boolean => x1 === x2 && y1 === y2;

export const gameboardFactory = (): Gameboard => ({
    shipInfoList: [],
    attackList: [],
    placeShip(ship, startingPoint, isHorizontal) {
        let { x, y } = startingPoint;
        if(x < 0 || y < 0) throw new Error(`coordinates (${x}, ${y}) out of bounds`);
        isHorizontal ? x += ship.length - 1 : y += ship.length - 1;
        if(y > 10 || x > 10) throw new Error(`coordinates (${x}, ${y}) out of bounds`);
        this.shipInfoList.push({
            ship,
            location: {
                point1: startingPoint,
                point2: { x, y },
            },
            isHorizontal,
        });
    },
    receiveAttack(attackPoint) {
        this.attackList.forEach((point) => {
            if(attackPoint.x === point.x && attackPoint.y === point.y)
                throw new Error(`Point (${attackPoint.x}, ${attackPoint.y}) has already been attacked`);
        });
        this.attackList.push(attackPoint);
        let shipInfo = this.getShipOnPoint(attackPoint);
        let isSunk: Ship | false = false;
        if(shipInfo !== false) {
            shipInfo.ship.hit();
            if(shipInfo.ship.isSunk()) {
                isSunk = shipInfo.ship;
            }
        }
        return {
            isHit: shipInfo ? attackPoint : false,
            isSunk,
            isAllSunken: this.isAllSunk(),
        };
    },
    getShipOnPoint(point) {
        for(const shipInfo of this.shipInfoList) {
            if (this.getShipPoints(shipInfo).some((shipPoint) => arePointsEqual(point, shipPoint)))
                return shipInfo;
        }
        return false;
    },
    getShipPoints({location: {point1, point2}, isHorizontal}) {
        let start: number, end: number = 0;
        const shipPoints: Point[] = [];
        if(isHorizontal) {
            start = point1.x;
            end = point2.x;
        } else {
            start = point1.y;
            end = point2.y;
        }
        for(; start <= end; start++) {
            shipPoints.push(isHorizontal ? { 
                x: start, 
                y: point1.y 
            } : {
                x: point1.x,
                y: start
            });
        }
        return shipPoints;
    },
    isAllSunk() {
        return this.shipInfoList.every(shipInfo => shipInfo.ship.isSunk());
    },
});
