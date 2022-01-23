export class Ship {
  public length: number;
  private hitLocations: boolean[];

  constructor(length: number) {
    this.length = length;
    this.hitLocations = new Array(length).fill(false);
  }

  public hit(location: number) {
    if (this.hitLocations[location]) {
      return false;
    }

    this.hitLocations[location] = true;

    return true;
  }

  public getHits(): boolean[] {
    return this.hitLocations;
  }

  public isSunk(): boolean {
    return (
      this.hitLocations.length === this.length &&
      this.hitLocations.every((h) => h)
    );
  }
}
