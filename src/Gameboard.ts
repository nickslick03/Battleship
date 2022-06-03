import { Ship, } from './Ship';

type Gameboard = {
    placeShip(ship: Ship, startingPoint: Point, isHorizontal: boolean): Point,
    receiveAttack(attackPoint: Point): AttackMessage,
    getShipOnPoint(point: Point): Ship | false; 
    isAllSunk(): boolean,
};

type ShipInfo = {
    ship: Ship,
    location: Location,
};

type Location = {
    point1: Point,
    point2: Point,
};

type Point = {
    x: number,
    y: number,
};

type AttackMessage = {
    isHit: Point | false;
    isSunk: Ship | false;
    isAllSunken: boolean;
};

export const gameboardFactory = (): Gameboard => {
    const shipList: ShipInfo[] = [];
    const attackList: Point[] = [];
    return {
        placeShip(ship, startingPoint, isHorizontal) {
            let { x, y } = startingPoint;
            isHorizontal ? y += ship.length - 1 : x += ship.length - 1;
            if(y > 10 || x > 10) throw new Error(`coordinates (${x}, ${y}) out of bounds`);
            shipList.push({
                ship,
                location: {
                    point1: startingPoint,
                    point2: { x, y },
                },
            });
            return { x, y };
        },
        receiveAttack(attackPoint) {
            attackList.forEach((point) => {
                if(attackPoint.x === point.x && attackPoint.y === point.y)
                    throw new Error(`Point (${attackPoint.x}, ${attackPoint.y}) has already been attacked`);
            });
            attackList.push(attackPoint);
            let ship = this.getShipOnPoint(attackPoint); 
            let isSunk: Ship | false = false;
            if(ship !== false) {
                ship.hit();
                if(ship.isSunk()) {
                    isSunk = ship;
                }
            }
            return {
                isHit: ship ? attackPoint : false,
                isSunk,
                isAllSunken: this.isAllSunk(),
            };
        },
        getShipOnPoint(point) {
            for(const shipInfo of shipList) {
                const { ship, location: { point1, point2 } } = shipInfo;
                if (point.x >= point1.x 
                    && point.x <= point2.x
                    && point.y >= point1.y 
                    && point.y <= point2.y) 
                    {
                        return ship;   
                    }
            }
            return false;
        },
        isAllSunk: () => shipList.every(shipInfo => shipInfo.ship.isSunk()),
    };
};
