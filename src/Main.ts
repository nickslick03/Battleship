import { startGame } from "./Game-loop";
import { playerFactory } from "./Player";
import { shipFactory } from "./Ship";
import { randomShipSelection, shipSelection } from "./shipSelection";

const main = async () => {
    const centerContainer = document.querySelector('.centerContainer') as HTMLDivElement;
    const title = document.createElement('h1');
    const computerButton = document.createElement('button');
    const twoPlayerButton = document.createElement('button');
    title.textContent = 'Battleship';
    computerButton.textContent = 'Computer';
    twoPlayerButton.textContent = '2 Player';
    [computerButton, twoPlayerButton].forEach(button => button.className = 'menuButton');
    [title, computerButton, twoPlayerButton].forEach(element => centerContainer.appendChild(element));
    centerContainer.style.opacity = '1';
    centerContainer.style.zIndex = '1';
    
    const clear = () => {
        centerContainer.textContent = '';
        centerContainer.style.opacity = '0';
        centerContainer.style.zIndex = '-1';
    };

    twoPlayerButton.addEventListener('click', () => {
        clear();
        const player1 = playerFactory(false);
        const player2 = playerFactory(false);
        shipSelection(player1, true)
        .then(() => shipSelection(player2, false))
        .then(() => startGame(player1, player2));
    });

    computerButton.addEventListener('click', () => {
        clear();
        const player1 = playerFactory(false);
        const player2 = playerFactory(true);
        const ships = randomShipSelection();
        console.log(ships);
        ships.forEach(({name, pointlist}) => player2.gameboard.addShip(shipFactory(name, pointlist)));
        shipSelection(player1, true)
        .then(() => startGame(player1, player2));
    });
}

main();




    