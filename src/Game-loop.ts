import { ComputerPlayer, computerPlayer } from "./Computer";
import { arePointsEqual, AttackMessage, Point, ShipInfo } from "./Gameboard";
import { basePlayerFactory, PersonPlayer, personPlayerFactory } from "./Player";
import { Ship } from "./Ship";

type GridPoint = {
    x: string,
    y: number,
}

export const startGame = (isComputer: boolean) => {
    const basePlayer1 = basePlayerFactory();
    const basePlayer2 = basePlayerFactory();
    const player1 = personPlayerFactory(basePlayer1, basePlayer2);
    const player2 = isComputer ? computerPlayer(basePlayer2, player1) : personPlayerFactory(basePlayer2, player1);
    for(let i = 0; i < 7; i ++) {
        player1.gameboard.placeShip(player1.shipList[i], {x: i + 1, y: 1}, false);
        player2.gameboard.placeShip(player1.shipList[i], {x: 1, y: i + 1}, true);
    }
    addPointEventListeners(takeTurn(player1, player2));
}

let isPlayer1Turn = true;
let isInTurn = false;
const gridList = Array.from(document.querySelector('.gamegrid')?.children as HTMLCollection) as HTMLDivElement[];
const turnElement = document.querySelector('h2') as HTMLHeadingElement;

const takeTurn = (player1: PersonPlayer, player2: ComputerPlayer | PersonPlayer): Function => {
    return async (point: Point, div: HTMLDivElement) => {
        if(isInTurn)
            return;
        else
            isInTurn = true;
        let currentPlayer = isPlayer1Turn ? player1 : player2;
        let nextPlayer = isPlayer1Turn ? player2 : player1;
        if(nextPlayer.gameboard.attackList.some(attackPoint => arePointsEqual(attackPoint, point))) {
            isInTurn = false;
            return;
        }
        let attackMessage = currentPlayer.attack(point);
        div.style.backgroundColor = determinePointColor(nextPlayer, point);
        await pause(1);
        gridList.forEach(div => div.style.backgroundColor = 'navy');
        await pause(1);
        currentPlayer.gameboard.attackList.forEach(
            point => pointConverters.pointToElement(point).style.backgroundColor = determinePointColor(
            currentPlayer,
            point));
        console.log(currentPlayer.gameboard.attackList);
        isPlayer1Turn = !isPlayer1Turn;
        turnElement.textContent = `Player ${isPlayer1Turn ? '1' : '2'}'s turn`;
        isInTurn = false;
    };
};
    
const determinePointColor = (player: ComputerPlayer | PersonPlayer, point: Point): 'white' | 'red' | 'black' => {
    const shipInfo = player.gameboard.getShipOnPoint(point);
    if(shipInfo !== false)
        if(shipInfo.ship.isSunk()){
            console.log(point);
            return 'black';
        } 
        else
            return 'red';
    else
        return 'white';
};

const addPointEventListeners = (takeTurn: Function) => {
    const gridList = document.querySelector('.gamegrid')?.children as HTMLCollection;
    Array.from(gridList).forEach((div, index) => 
        div.addEventListener('click', () => 
            takeTurn(pointConverters.indexToPoint(index), div as HTMLDivElement))
    );
};

const pointConverters = (() => {
     const letterList = [...'ABCDEFGHIJ'];
    return {
        pointToGridPoint: ({ x, y }: Point): GridPoint => ({x: letterList[x - 1], y}),
        pointToElement: ({ x, y }: Point): HTMLDivElement => gridList[ x - 1 + (y - 1) * 10],
        indexToPoint: (index: number): Point => ({ x: index % 10 + 1, y: Math.floor(index / 10) + 1,}),
    }
})();


/**
 * Pauses the script for a set amount of seconds. Use await keyword before function.
 * @param seconds - number of seconds to pause.
 */
const pause = async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));