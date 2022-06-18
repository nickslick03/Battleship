import { AttackInfo } from "./Gameboard";
import { computerMove, Player, playerFactory } from "./Player";
import { arePointsEqual, Point } from "./Ship";

export const indexToPoint = (index: number): Point => ({
    x: index % 10 + 1, 
    y: Math.floor(index / 10) + 1,
});

export const pointToIndex = ({ x, y }: Point): number =>  x - 1 + (y - 1) * 10;

type Gamegrid = {
    container: HTMLDivElement,
    centerContainer: HTMLDivElement,
    children: HTMLDivElement[],
    turnLabel: HTMLHeadingElement,
    addEvent(): void,
    removeEvent(): void,
}

const gamegridEventListener = async (takeTurn: Function, isPlayer2Computer: boolean) => {
    const container = document.querySelector('.gamegrid') as HTMLDivElement;
    const children = Array.from(container.children) as HTMLDivElement[];
    const gamegrid: Gamegrid = {
        container,
        centerContainer: document.querySelector('.centerContainer') as HTMLDivElement, 
        children,
        turnLabel: document.querySelector('.turn') as HTMLHeadingElement,
        addEvent: () => container.addEventListener('click', targetToPoint),
        removeEvent: () => container.removeEventListener('click', targetToPoint),
    }
    let isPlayer1sTurn = true;
    gamegrid.turnLabel.textContent = 'Player 1\'s Turn';
    gamegrid.centerContainer.textContent = 'Battleship has started!';
    gamegrid.centerContainer.style.animation = 'attackMessage 3s';
    gamegrid.centerContainer.style.zIndex = '1';
    await pause(3);
    gamegrid.centerContainer.style.animation = '';
    gamegrid.centerContainer.style.zIndex = '';
    const targetToPoint = async ({target}: MouseEvent) => {
        const index = children.indexOf(target as HTMLDivElement);
        if(index > -1) {
            if(isPlayer1sTurn === false && isPlayer2Computer)
                return;
            await takeTurn(gamegrid, isPlayer1sTurn, indexToPoint(index));
            isPlayer1sTurn = isPlayer1sTurn ? false : true;
            if(isPlayer1sTurn === false && isPlayer2Computer) {
                await takeTurn(gamegrid, false, {x: 0, y: 0});
                isPlayer1sTurn = true;
            }
        }
    };
    gamegrid.addEvent();
};

export function startGame(player1: Player, player2: Player) {
    gamegridEventListener(takeTurn(player1, player2), player2.isComputer);
}

const pointColor = (point: Point) => {
    if(point.isSunk) return 'black';
    if(point.isHit) return 'red';
    return 'white';
};

const attackInfoToMessage = (attackInfo: AttackInfo): string => {
    if(attackInfo.isAllSunk) return 'You win!';
    if(attackInfo.isSunk) return `${attackInfo.isSunk} has been sunk!`;
    if(attackInfo.isHit) return 'Hit!';
    return 'Miss.';
}

export const pause = async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const takeTurn = (player1: Player, player2: Player) => {
    let inMiddleOfTurn = false;
    return async (gamegrid: Gamegrid, isPlayer1sTurn: boolean, attackPoint: Point) => {
        const attackingPlayer = isPlayer1sTurn ? player1 : player2;
        const defendingPlayer = isPlayer1sTurn ? player2 : player1;
        if (inMiddleOfTurn
            || defendingPlayer.gameboard.attacklist.some(point => arePointsEqual(point, attackPoint)))
            return;
        inMiddleOfTurn = true;
        if(isPlayer1sTurn === false && player2.isComputer) attackPoint = computerMove(player1);
        const attackInfo = defendingPlayer.gameboard.recieveAttack(attackPoint);
        gamegrid.children[pointToIndex(attackPoint)].style.background = pointColor(attackInfo.returnPoint);
        if(attackInfo.isSunk)
            defendingPlayer.gameboard.attacklist.forEach(point => {
                if(point.isSunk) {
                    gamegrid.children[pointToIndex(point)].style.backgroundColor = 'black';
                }
            });
        gamegrid.centerContainer.textContent = attackInfoToMessage(attackInfo);
        gamegrid.centerContainer.style.animation = 'attackMessage 3s';
        gamegrid.centerContainer.style.zIndex = '1';
        await pause(3);
        if(attackInfo.isAllSunk) 
            return;
        gamegrid.centerContainer.style.animation = '';
        gamegrid.centerContainer.style.zIndex = '';
        gamegrid.children.forEach(div => div.style.backgroundColor = 'navy');
        await pause(1);
        attackingPlayer.gameboard.attacklist.forEach(point => {
            const div = gamegrid.children[pointToIndex(point)];
            div.style.backgroundColor = pointColor(point);
        });
        gamegrid.turnLabel.textContent = `Player ${isPlayer1sTurn ? '2' : '1'}'s Turn`;
        gamegrid.addEvent();
        inMiddleOfTurn = false;
    };
};