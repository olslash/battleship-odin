import { BoardSquare } from "./gameBoard";
import { Player } from "./types";

export function updateDOM(board: BoardSquare[][], player: Player) {
  const gridEl = document.getElementById("grid");
  const playerNameEl = document.getElementById("player");
  gridEl!.innerHTML = "";
  playerNameEl!.innerHTML = `Player ${player}`;

  // fixme: why arent these y,x?
  board.forEach((row, x) => {
    row.forEach((square, y) => {
      const el = document.createElement("div");

      el.classList.add("square");
      el.dataset.x = x.toString();
      el.dataset.y = y.toString();

      if (square.ship) {
        el.classList.add("ship");
      }

      if (square.miss) {
        el.classList.add("miss");
      }

      if (square.ship?.isSunk()) {
        el.classList.add("sunk");
      } else if (
        typeof square.shipLocation === "number" &&
        square.ship?.getHits()[square.shipLocation]
      ) {
        el.classList.add("hit");
      }

      gridEl!.appendChild(el);
    });
  });
}
