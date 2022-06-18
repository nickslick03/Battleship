import { indexToPoint } from "./Game-loop";
import { arePointlistsOverlapping, gameboardFactory } from "./Gameboard";
import { pointlistFactory, pointInBounds, shipFactory, getStartingPointBoundary } from "./Ship";

test('ship object', () => {
    expect(getStartingPointBoundary(5, true)).toEqual({x: 6, y: 10});
    expect(getStartingPointBoundary(3, false)).toEqual({x: 10, y: 8});

    const ship = shipFactory('Carrier', pointlistFactory(5, {x: 1, y: 1}, true));
    expect(ship.pointlist[4]).toEqual({x: 5, y: 1, isHit: false, isSunk: false});
    expect(ship.isSunk()).toBe(false);
    
    expect(ship.hit({x: 1, y: 1})).toBe(true);
    expect(ship.hit({x: 1, y: 1})).toBe(false);
    expect(ship.hit({x: 10, y: 10})).toBe(false);
    
    ship.hit({x: 2, y: 1});
    ship.hit({x: 3, y: 1});
    ship.hit({x: 4, y: 1});
    ship.hit({x: 5, y: 1});
    console.log(ship.pointlist);
    
    expect(ship.isSunk()).toBe(true);
    
    ship.pointlist.forEach(point => expect(point.isSunk).toBe(true));
    
    expect(pointInBounds({x: 10, y: 1})).toBe(true);
    expect(pointInBounds({x: 0, y: 11})).toBe(false);
});

test('gameboard object', () => {
    const shipA = shipFactory('a', pointlistFactory(8, {x: 1, y: 5}, true));
    const shipB = shipFactory('b', pointlistFactory(5, {x: 5, y: 1}, false));
    console.log(shipA.pointlist, shipB.pointlist);
    expect(arePointlistsOverlapping(shipA.pointlist, shipB.pointlist)).toBe(true);

    const board = gameboardFactory();
    expect(board.addShip(shipA)).toBe(true);
    expect(board.addShip(shipB)).toBe(false);

    board.addShip(shipFactory('C', pointlistFactory(4, {x: 5, y: 6}, true)));
    
    //expect(board.recieveAttack({x: 6, y: 6})).toEqual({isHit: true, isSunk: false, isAllSunk: false});
    board.recieveAttack({x: 5, y: 6});
    board.recieveAttack({x: 7, y: 6});
    //expect(board.recieveAttack({x:8, y: 6})).toEqual({isHit: true, isSunk: 'C', isAllSunk: false});

   // expect(board.recieveAttack({x: 10, y: 10})).toEqual({isHit: false, isSunk: false, isAllSunk: false});
    console.log(board.attacklist);

    board.recieveAttack({x: 1, y: 5});
    board.recieveAttack({x: 2, y: 5});
    board.recieveAttack({x: 3, y: 5});
    board.recieveAttack({x: 4, y: 5});
    board.recieveAttack({x: 5, y: 5});
    board.recieveAttack({x: 6, y: 5});
    board.recieveAttack({x: 7, y: 5});
    expect(board.recieveAttack({x: 8, y: 5})).toEqual({isHit: true, isSunk: 'a', isAllSunk: true});
});

test('Game-loop', () => {
    expect(indexToPoint(33)).toEqual({x: 4, y: 4});
});