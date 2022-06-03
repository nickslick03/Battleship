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
    expect(game.placeShip(shipFactory('carrier', 3), {x: 3, y: 8}, false)).toEqual({ x: 5, y: 8});
    expect(game.placeShip(shipFactory('Carrier', 5), {x: 2, y: 7}, false)).toEqual({x: 6, y: 7});
    expect(game.receiveAttack({x: 1, y: 1})).toEqual({isHit: false, isSunk: false, isAllSunken: false});
    expect(game.receiveAttack({x: 4, y: 8})).toEqual({isHit: {x: 4, y: 8}, isSunk: false, isAllSunken: false});
    game.receiveAttack({x: 3, y: 8})
    console.log(game.receiveAttack({x: 5, y: 8}));
    game.receiveAttack({x: 2, y: 7})
    game.receiveAttack({x: 3, y: 7})
    game.receiveAttack({x: 4, y: 7})
    game.receiveAttack({x: 5, y: 7})
    console.log(game.receiveAttack({x: 6, y: 7}));
});