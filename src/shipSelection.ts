import { indexToPoint, pause, pointToIndex } from "./Game-loop";
import { Player, randomCoordinate } from "./Player";
import { arePointsEqual, getStartingPointBoundary, Point, pointlistFactory, shipFactory } from "./Ship";

type shipInWaiting = {
    name: string,
    length: number,
    pointlist: Point[],
};

const getShipList = (): shipInWaiting[] => [
    { name: 'Aircraft Carrier', length: 5, pointlist: [] },
    { name: 'Battleship', length: 4, pointlist: [] },
    { name: 'Crusier', length: 3, pointlist: [] },
    { name: 'Destroyer', length: 2, pointlist: [] },
    { name: 'Destroyer', length: 2, pointlist: [] },
    { name: 'Submarine', length: 1, pointlist: [] },
    { name: 'Submarine', length: 1, pointlist: [] },
];

const grid = (() => {
    const container = document.querySelector('.gamegrid') as HTMLDivElement;
    const children = Array.from(container.children) as HTMLDivElement[];
    return {
        container,
        children,
        centerContainer: document.querySelector('.centerContainer') as HTMLDivElement,
        turn: document.querySelector('.turn') as HTMLHeadingElement,
    }
})();

const shipSelectionContainer = document.querySelector('.shipSelectionContainer') as HTMLDivElement;
const shipButtonList = Array.from((document.querySelector('.shipButtonContainer') as HTMLDivElement).children) as HTMLDivElement[];
const doneButton = document.querySelector('.doneButton') as HTMLDivElement;

let currentShipIndex = 0;
let isHorizontal = false;

shipButtonList.forEach((button, index) => button.addEventListener('click', () => currentShipIndex = index ));
document.querySelector('.rotate')?.addEventListener('click', () => isHorizontal = !isHorizontal);

shipSelectionContainer.remove();

const isOutOfBounds = (pointlist: Point[], isHorizontal: boolean) => {
    const boundaryPoint = getStartingPointBoundary(pointlist.length, isHorizontal);
    return isHorizontal && pointlist[0].x > boundaryPoint.x 
    || isHorizontal === false && pointlist[0].y > boundaryPoint.y;
};

const isOverlapping = (futurePointlist: Point[], shiplist: shipInWaiting[], currentShipIndex: number) =>
    shiplist
        .filter(({pointlist}, index) => pointlist.length > 0 && index !== currentShipIndex)
        .some(({pointlist}) => 
        pointlist.some((point: Point) => 
            futurePointlist.some(futurePoint => 
                arePointsEqual(point, futurePoint)
                )
            )
        );

const validateShipPlacement = (pointlist: Point[], shiplist: shipInWaiting[], isHorizontal: boolean, currentShipIndex: number) => 
    isOutOfBounds(pointlist, isHorizontal) === false && isOverlapping(pointlist, shiplist, currentShipIndex) === false;

export const randomShipSelection = () => {
    const shiplist = getShipList();
    shiplist.forEach((shipInWaiting, index) => {
        let pointlist: Point[];
        let isHorizontal: boolean;
        do {
            isHorizontal = randomBoolean();
            pointlist = pointlistFactory(
                shipInWaiting.length, 
                { 
                    x: randomCoordinate(), 
                    y: randomCoordinate() 
                },
                isHorizontal
            );
            
        } while (validateShipPlacement(pointlist, shiplist, isHorizontal, index) === false);
        shipInWaiting.pointlist = pointlist;
    });
    return shiplist;
}

export const shipSelection = async (player: Player, isPlayerOne: boolean) => {

    grid.centerContainer.textContent = `Player ${isPlayerOne ? '1' : '2'} Ship Selection`;
    grid.turn.textContent = `Player ${isPlayerOne ? '1' : '2'}'s Turn`;
    grid.centerContainer.style.animation = 'attackMessage 3s';
    grid.centerContainer.style.zIndex = '1';
    await pause(3);
    grid.centerContainer.style.animation = '';
    grid.centerContainer.style.zIndex = '-1';
    
    document.querySelector('#app')?.appendChild(shipSelectionContainer);

    const shiplist = getShipList();

    const shipHover = () => grid.children.forEach(div => {
        div.addEventListener('mouseover', renderShip);
        div.addEventListener('mouseleave', clearBoard);
        div.addEventListener('click', placeShip);
    });

    const createPointList = (div: HTMLDivElement) => {
        const pointlist = pointlistFactory(
            shiplist[currentShipIndex].length, 
            indexToPoint(grid.children.indexOf(div)),
            isHorizontal);
        if(validateShipPlacement(pointlist, shiplist, isHorizontal, currentShipIndex))
            return pointlist;
        return false;
    };

    const renderShip = (e: MouseEvent) => {
        const pointlist = createPointList(e.target as HTMLDivElement);
        if(pointlist === false) return;
        pointlist.forEach(point =>
            grid.children[pointToIndex(point)].style.backgroundColor = e.type === 'mouseover' ? 'rgba(100, 100, 100, .5)' : 'gray'
        );
    };

    const clearBoard = () => {
        grid.children.forEach(div => div.style.backgroundColor = 
            shiplist.some(({pointlist}) => pointlist.some(point => 
                arePointsEqual(indexToPoint(grid.children.indexOf(div)), point))) ? 'gray' : 'navy' );
    };

    const placeShip = (e: MouseEvent) => {
        const pointlist = createPointList(e.target as HTMLDivElement);
        if(pointlist === false) return;
        shiplist[currentShipIndex].pointlist.forEach(point => grid.children[pointToIndex(point)].style.backgroundColor = 'navy');
        renderShip(e);
        shiplist[currentShipIndex].pointlist = pointlist;
        shipButtonList[currentShipIndex].style.backgroundColor = 'rgb(80, 255, 40)';
        if(shiplist.every(({pointlist}) => pointlist.length > 0))
            doneButton.style.visibility = 'visible';
    };

    shipHover();

    return new Promise<void>((resolve) => {
        doneButton.addEventListener('click', () => {
            grid.children.forEach(div => {
                div.removeEventListener('mouseover', renderShip);
                div.removeEventListener('mouseleave', clearBoard);
                div.removeEventListener('click', placeShip);
            });
            shiplist.forEach(({ name, pointlist }) => player.gameboard.addShip(shipFactory(name, pointlist)));
            grid.children.forEach(div => div.style.backgroundColor = '');
            shipButtonList.forEach(button => button.style.backgroundColor = '');
            doneButton.style.visibility = 'hidden';
            shipSelectionContainer.remove();
            currentShipIndex = 0;
            isHorizontal = false;
            resolve();
        });
    });
    
};
    
const randomBoolean = () => Math.round(Math.random()) === 1 ? true : false;
