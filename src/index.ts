import { Player } from "./types";
import { Ship } from "./ship";
import { GameBoard } from "./gameBoard";
import { waitForMove } from "./util";
import { updateDOM } from "./dom";
import "./index.css";

class Game {
  private boardSize = 10;
  private playerShips = [1, 2, 4, 6];
  private boards = this.initBoards();
  private currentPlayer: Player = 0;

  public async run(): Promise<Player> {
    const result = await this.gameLoop();

    return result;
  }

  private async gameLoop(): Promise<Player> {
    while (true) {
      // loop until someone wins or there's a tie

      const otherPlayer = this.currentPlayer === 0 ? 1 : 0;
      const otherPlayerBoard = this.boards[otherPlayer];

      updateDOM(otherPlayerBoard.getBoard(), this.currentPlayer);

      while (true) {
        // wait for a valid move

        const [x, y] = await waitForMove(this.currentPlayer);
        const result = otherPlayerBoard.receiveAttack([x, y]);

        if (result) {
          alert(`${result}!`);
          break;
        }
      }

      const playerWon = otherPlayerBoard.hasLost();
      if (playerWon) {
        return this.currentPlayer;
      }

      this.currentPlayer = otherPlayer;
    }
  }

  private initBoards() {
    const p1Board = new GameBoard(this.boardSize);
    this.playerShips
      .map((size) => new Ship(size))
      .forEach((ship, i) => p1Board.addShip(ship, [0, i], "v"));

    const p2Board = new GameBoard(this.boardSize);
    this.playerShips
      .map((size) => new Ship(size))
      .forEach((ship, i) => p2Board.addShip(ship, [4, i], "v"));

    return [p1Board, p2Board];
  }
}

const game = new Game();
game.run().then((result) => {
  alert(`Player ${result} wins!`);
});
