export interface IShape {
  baseX: number;
  baseY: number;

}

export abstract class Shape implements IShape {
  baseX: number;
  baseY: number;

  constructor(x: number, y: number) {
    this.baseX = x;
    this.baseY = y;
  }

  draw(context: CanvasRenderingContext2D) {};
}