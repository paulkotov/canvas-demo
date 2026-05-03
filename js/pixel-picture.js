import { Pixel } from './pixel.js';

export const HEART = [
  [null,   '#e05', '#e05', null,   null,   '#e05', '#e05', null  ],
  ['#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05'],
  ['#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05'],
  [null,   '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', null  ],
  [null,   null,   '#e05', '#e05', '#e05', '#e05', null,   null  ],
  [null,   null,   null,   '#e05', '#e05', null,   null,   null  ],
];

export const STAR = [
  [null,   null,   '#fc0', null,   null  ],
  ['#fc0', null,   '#fc0', null,   '#fc0'],
  [null,   '#fc0', '#fc0', '#fc0', null  ],
  ['#fc0', '#fc0', '#fc0', '#fc0', '#fc0'],
  [null,   '#fc0', null,   '#fc0', null  ],
];

export const DIAMOND = [
  [null,   null,   '#0ee', null,   null  ],
  [null,   '#0ee', '#0ee', '#0ee', null  ],
  ['#0ee', '#0ee', '#0ee', '#0ee', '#0ee'],
  [null,   '#0ee', '#0ee', '#0ee', null  ],
  [null,   null,   '#0ee', null,   null  ],
];

export class PixelPicture {
  #pixels;
  #cells;
  #x;
  #y;
  #cols;
  #rows;
  #pixelSize;

  constructor(grid, x, y, pixelSize, options = {}) {
    this.#x = x;
    this.#y = y;
    this.#rows = grid.length;
    this.#cols = grid[0]?.length ?? 0;
    this.#pixelSize = pixelSize;
    this.#pixels = [];
    this.#cells = [];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const color = grid[row][col];
        if (color === null) continue;

        const px = x + col * pixelSize;
        const py = y + row * pixelSize;

        this.#cells.push({ x: px, y: py, color });
        this.#pixels.push(new Pixel(
          px, py, color,
          options.speed     ?? 0.5,
          options.delay     ?? 0,
          options.delayHide ?? 0,
          options.step      ?? 1,
          options.boundSize ?? pixelSize,
        ));
      }
    }
  }

  get bounds() {
    return {
      x: this.#x,
      y: this.#y,
      w: this.#cols * this.#pixelSize,
      h: this.#rows * this.#pixelSize,
    };
  }

  isHovered(mx, my) {
    const { x, y, w, h } = this.bounds;
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
  }

  show() {
    for (const pixel of this.#pixels) pixel.show();
  }

  hide() {
    for (const pixel of this.#pixels) pixel.hide();
  }

  drawGhost(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    for (const { x, y, color } of this.#cells) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, this.#pixelSize, this.#pixelSize);
    }
    ctx.restore();
  }

  draw(ctx) {
    for (const pixel of this.#pixels) pixel.draw(ctx);
  }
}
