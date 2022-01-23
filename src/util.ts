import { Player } from "./types";

export async function waitForMove(player: Player) {
  return new Promise<[number, number]>((resolve) => {
    document.body.addEventListener("click", function clickListener(e) {
      const hitX = (e.target! as HTMLElement).getAttribute("data-x");
      const hitY = (e.target! as HTMLElement).getAttribute("data-y");

      document.body.removeEventListener("click", clickListener);

      resolve([Number(hitX), Number(hitY)]);
    });
  });
}
