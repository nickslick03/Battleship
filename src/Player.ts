import { Gameboard, gameboardFactory } from "./Gameboard";
import { arePointsEqual, Point } from "./Ship";

export type Player = {
    gameboard: Gameboard,
    isComputer: boolean,
}

export const playerFactory = (isComputer: boolean): Player => ({
    gameboard: gameboardFactory(),
    isComputer,
}); 

export const computerMove = ({ gameboard }: Player): Point => {
    let attackPoint: Point;
    do {
        attackPoint = {
            x: randomCoordinate(),
            y: randomCoordinate(),
        }
    } while (gameboard.attacklist.some(point => arePointsEqual(point, attackPoint)));
    return attackPoint;
};

export const randomCoordinate = () => Math.floor(Math.random() * 10) + 1;