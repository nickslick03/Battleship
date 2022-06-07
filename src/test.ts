import { gameboardFactory } from "./Gameboard";
import { shipFactory } from "./Ship";

test('ship object', () => {
    const ship = shipFactory('Carrier', 5);
    expect(ship.length).toEqual(5);
    ship.hit();
    expect(ship.isSunk()).toEqual(false);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toEqual(true);
});

test('gameboard object', () => {
    const game = gameboardFactory();
    game.placeShip(shipFactory('Carrier', 5), {x: 1, y: 1}, false);
    console.log(game.getShipPoints(game.shipInfoList[0]))
});