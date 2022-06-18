import { arePointsEqual, Point, Ship, shipFactory } from "./Ship";

export type Gameboard = {
    readonly attacklist: Point[],
    addShip(newShip: Ship): boolean,
    recieveAttack(attackPoint: Point): AttackInfo,
};

export type AttackInfo = {
    returnPoint: Point,
    isHit: boolean,
    isSunk: string | false,
    isAllSunk: boolean,
}

export const arePointlistsOverlapping = (pointlist1: Point[], pointlist2: Point[]) =>
    pointlist1.some(point1 =>
        pointlist2.some(point2 =>
            arePointsEqual(point1, point2)
        )
    );

const areAllShipsSunk = (shiplist: Ship[]) => shiplist.every(ship => ship.isSunk());

export function gameboardFactory(): Gameboard {
    const shiplist: Ship[] = [];
    const attackList: Point[] = [];
    return {
        get attacklist() {
            return [...attackList];
        },
        addShip(newShip: Ship): boolean {
            if (shiplist.some(ship => arePointlistsOverlapping(ship.pointlist, newShip.pointlist)))
                return false;
            shiplist.push(newShip);
            return true;
        },
        recieveAttack(attackPoint: Point): AttackInfo {
            let returnPoint = attackPoint;
            const hitShip = shiplist.find(ship => ship.hit(attackPoint) ? ship : false);
            const isShipSunk = hitShip !== undefined ? hitShip.isSunk() : false;
            const isAllSunk = areAllShipsSunk(shiplist);
            if(hitShip) {
                returnPoint = hitShip.pointlist.find(point => arePointsEqual(point, attackPoint)) as Point;
                attackList.push(returnPoint);
            } else {
                returnPoint.isMiss = true;   
            }
            attackList.push(returnPoint);
            return {
                returnPoint,
                isHit: hitShip !== undefined ? true : false,
                isSunk: isShipSunk ? (hitShip as Ship).name : false,
                isAllSunk,
            };
        },
    };
}