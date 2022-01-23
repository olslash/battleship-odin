import { Ship } from "./ship";

export interface BoardSquare {
  ship: Ship | null;
  shipLocation: number | null;
  miss: boolean;
}

export type Coord = [number, number];
export type Orientation = "v" | "h";

export class GameBoard {
  private size: number;
  private ships: Ship[];
  private board: BoardSquare[][];

  constructor(size: number) {
    this.size = size;
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
    const shipAlreadyAtOrigin = !!this.board[x][y].ship;
    const shipAlreadyExistsOnBoard = this.ships.includes(ship);

    if (shipAlreadyAtOrigin || shipAlreadyExistsOnBoard) {
      return false;
    }

    const placementCoords = new Array(ship.length)
      .fill(null)
      .map((_, i) => (orientation === "v" ? [x + i, y] : [x, y + i]));

    const anyOverlaps = placementCoords.some(([x, y]) => this.board[x][y].ship);
    const goesOffBoard = placementCoords.some(
      ([x, y]) => x > this.size - 1 || y > this.size - 1
    );

    if (anyOverlaps || goesOffBoard) {
      return false;
    }

    placementCoords.forEach(([x, y], i) => {
      const square: BoardSquare = { ship, shipLocation: i, miss: false };
      this.board[x][y] = square;
    });

    this.ships.push(ship);

    return true;
  }

  public receiveAttack([x, y]: Coord): "miss" | "hit" | "sunk" | false {
    const square = this.board[x][y];

    if (square.ship && typeof square.shipLocation === "number") {
      const alreadyHit = !square.ship.hit(square.shipLocation);

      if (alreadyHit) {
        // already hit, invalid
        return false;
      }

      if (square.ship.isSunk()) {
        return "sunk";
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
