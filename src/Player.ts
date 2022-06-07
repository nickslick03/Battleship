import { AttackMessage, Gameboard, gameboardFactory, Point } from "./Gameboard";
import { Ship, shipFactory } from "./Ship";

export type BasePlayer = {
    gameboard: Gameboard,
    shipList: Ship[],
}

export type PersonPlayer = BasePlayer & {
    attack(attackPoint: Point): AttackMessage,
}

export const basePlayerFactory = (): BasePlayer => ({
    gameboard: gameboardFactory(),
    shipList: [
        shipFactory('Aircraft Carrier', 5),
        shipFactory('Battleship', 4),
        shipFactory('Crusier', 3),
        shipFactory('Destroyer', 2),
        shipFactory('Destroyer', 2),
        shipFactory('Submarine', 1),
        shipFactory('Submarine', 1),
    ],
});

export const personPlayerFactory = (basePlayer: BasePlayer, enemyPlayer: BasePlayer): PersonPlayer => ({
    ...basePlayer,
    attack: (attackPoint: Point) => enemyPlayer.gameboard.receiveAttack(attackPoint),
});