import { AttackMessage, Point } from "./Gameboard";
import { BasePlayer, PersonPlayer } from "./Player";

export type ComputerPlayer = BasePlayer & {
    attack(): AttackMessage;
}

export const computerPlayer = (basePlayer: BasePlayer, enemyPlayer: PersonPlayer): ComputerPlayer => ({
    ...basePlayer,
    attack() {
        let randomPoint: Point = {x: 0, y: 0};
        do {
            randomPoint.x = getRandomNum();
            randomPoint.y = getRandomNum();
        } while(checkPoint(randomPoint, this.gameboard.attackList));
        return enemyPlayer.gameboard.receiveAttack(randomPoint);
    }
});

const getRandomNum = (): number => {
    let num = Math.random() * 10 + 1;
    return Math.floor(num);
}

const checkPoint = (randomPoint: Point, attackList: Point[]): boolean => 
    attackList.some((attackPoint) => 
        attackPoint.x === randomPoint.x
        && attackPoint.y === randomPoint.y
    );