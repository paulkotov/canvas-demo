export class Drawable {
  constructor(canvas) {
    this.unit = 20;
    this.context = canvas.getContext("2d");
    this.width = canvas.width / this.unit;
    this.height = canvas.height / this.unit;
  }

  drawAt(x, y, color = "black") {
    const { context, unit } = this;
    context.fillStyle = color;
    context.fillRect(x * unit + 1, y * unit + 1, unit - 2, unit - 2);
  }

  outline() {
    const { context, width, height, unit } = this;
    context.strokeStyle = "lightgrey";
    for (let x = 0; x < width; ++x) {
      context.strokeRect(x * unit, 0, unit, height * unit);
    }
    for (let y = 0; y < height; ++y) {
      context.strokeRect(0, y * unit, width * unit, unit);
    }
  }

  clear() {
    const { context, unit, width, height } = this;
    context.clearRect(0, 0, unit * width, unit * height);
    this.outline();
  }
}
