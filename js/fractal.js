import { get } from './utils.js';

export class Fractal {
  context = null;
  params = {};
// graph drawing class
  constructor(canvasRef, fractalParams) {
    if (!canvasRef || !(canvasRef instanceof HTMLCanvasElement)) {
      throw Error('Error with accessing canvas');
    }
    this.width = canvasRef.width;
    this.height = canvasRef.height;

    const ctx = canvasRef.getContext('2d');
    ctx.lineWidth = get(fractalParams, 'lineWidth', 10);
    ctx.lineCap = 'round';
    ctx.shadowColor = get(fractalParams, 'shadowColor', 'rgba(100, 150, 255, 0.5)');
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = get(fractalParams, 'shadowBlur', 15);
    this.context = ctx;

    this.params.size = get(fractalParams, 'size', 300);
    this.params.sides = get(fractalParams, 'sides', 5);
    this.params.maxLevel = get(fractalParams, 'maxLevel', 2);
    this.params.scale = get(fractalParams, 'scale', 0.7);
    this.params.spread = get(fractalParams, 'spread', 0.5);
    this.params.branches = get(fractalParams, 'branches', 2);
    this.params.baseHue = get(fractalParams, 'baseHue', 200);
    this.params.twist = get(fractalParams, 'twist', 0);
  }

  #drawBranch = (level) => {
    if (level === undefined || level > this.params.maxLevel) {
      return;
    }
    const hueShift = (level / this.params.maxLevel) * 120;
    this.context.strokeStyle = `hsl(${this.params.baseHue + hueShift}, 100%, 50%)`;

    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(this.params.size, 0);
    this.context.stroke();

    // twist ratio shifts angle between the two sides while keeping them on
    // opposite sides: upperAngle stays positive, lowerAngle stays negative
    const upperAngle = this.params.spread * (1 + this.params.twist);
    const lowerAngle = this.params.spread * (1 - this.params.twist);

    for (let i = 0; i < this.params.branches; i++) {
      const tx = this.params.size - (this.params.size / this.params.branches) * i;

      this.context.save();
      this.context.translate(tx, 0);
      this.context.rotate(upperAngle);
      this.context.scale(this.params.scale, this.params.scale);
      this.#drawBranch(level + 1);
      this.context.restore();

      this.context.save();
      this.context.translate(tx, 0);
      this.context.rotate(-lowerAngle);
      this.context.scale(this.params.scale, this.params.scale);
      this.#drawBranch(level + 1);
      this.context.restore();
    }
  }

  draw = (position, scale, rotate) => {
    this.context.save();
    this.context.translate(
      get(position, 'x', this.width / 2),
      get(position, 'y', this.height / 2)
    );
    const scaleValue = scale || this.params.scale || 1;
    this.context.scale(scaleValue, scaleValue);
    this.context.rotate(rotate || 0);

    for (let i = 0; i < this.params.branches; i++) {
      this.context.rotate((Math.PI * 2) / this.params.branches);
      this.#drawBranch(0);
    }
    this.context.restore();
  }
}

export const getRandomFractalParams = () => {
  return {
    baseHue: Math.floor(Math.random() * 360),
    branches: Math.floor(Math.random() * 3) + 3,
    spread: +(Math.random() * 1.4 + 0.1).toFixed(1),
    sides: Math.floor(Math.random() * 10) + 3,
    scale: +(Math.random() * 0.7 + 0.3).toFixed(1),
    angle: Math.floor(Math.random() * 181),
    randomHue: Math.floor(Math.random() * 360),
    twist: +(Math.random() * 1.8 - 0.9).toFixed(2),
  };
};
