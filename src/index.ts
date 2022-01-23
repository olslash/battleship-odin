import { Player } from "./types";
import { Ship } from "./ship";
import { GameBoard } from "./gameBoard";
import { waitForMove } from "./util";
import { updateDOM } from "./dom";
import "./index.css";

async function main() {
  const result = await game();
  alert(`Player ${result} wins!`);
}

async function game(): Promise<Player> {
  const boardSize = 10;
  const playerShips = [1, 2, 4, 6];

  const p1Board = new GameBoard(boardSize);
  playerShips
    .map((size) => new Ship(size))
    .forEach((ship, i) => p1Board.addShip(ship, [0, i], "v"));

  const p2Board = new GameBoard(boardSize);
  playerShips
    .map((size) => new Ship(size))
    .forEach((ship, i) => p2Board.addShip(ship, [4, i], "v"));

  const boards = [p1Board, p2Board];
  let currentPlayer: Player = 0;

  while (true) {
    // loop until someone wins or there's a tie

    // @ts-ignore ??
    const otherPlayer = currentPlayer === 0 ? 1 : 0;
    const otherPlayerBoard = boards[otherPlayer];

    updateDOM(otherPlayerBoard.getBoard(), currentPlayer);

    while (true) {
      // wait for a valid move

      const [x, y] = await waitForMove(currentPlayer);
      const result = otherPlayerBoard.receiveAttack([x, y]);

      if (result) {
        alert(`${result}!`);
      }

      if (result) {
        break;
      }
    }

    const loss = otherPlayerBoard.hasLost();
    if (loss) {
      return currentPlayer;
    }

    currentPlayer = otherPlayer;
  }
}

main();
