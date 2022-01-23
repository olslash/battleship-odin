import { Ship } from "./ship";

export interface BoardSquare {
  ship: Ship | null;
  shipLocation: number | null;
  miss: boolean;
}

export type Coord = [number, number];
export type Orientation = "v" | "h";

export class GameBoard {
  private ships: Ship[];
  private board: BoardSquare[][];

  constructor(size: number) {
    this.ships = [];
    this.board = new Array(size).fill(null);
    this.board = this.board.map((_) =>
      new Array(size).fill(null).map((_) => ({
        ship: null,
        shipLocation: null,
        miss: false,
      }))
    );
  }

  public addShip(ship: Ship, [x, y]: Coord, orientation: Orientation): boolean {
    if (this.board[x][y].ship || this.ships.includes(ship)) {
      return false;
    }

    this.ships.push(ship);

    for (let i = 0; i < ship.length; i++) {
      let coords: Coord;
      if (orientation === "v") {
        coords = [x + i, y];
      } else {
        coords = [x, y + i];
      }

      const square: BoardSquare = { ship, shipLocation: i, miss: false };
      this.board[coords[0]][coords[1]] = square;
    }

    return true;
  }

  public receiveAttack([x, y]: Coord): "miss" | "hit" | false {
    const square = this.board[x][y];

    if (square.ship && typeof square.shipLocation === "number") {
      const alreadyHit = !square.ship.hit(square.shipLocation);

      if (alreadyHit) {
        // already hit, invalid
        return false;
      }

      return "hit";
    }

    if (square.miss) {
      return false;
    }

    square.miss = true;
    return "miss";
  }

  public hasLost(): boolean {
    return this.ships.every((s) => s.isSunk());
  }

  public getBoard() {
    return this.board;
  }
}
