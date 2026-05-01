function rand(min, max) {
  return min + Math.random() * (max - min);
}

const HEART = [
  [null,   '#e05', '#e05', null,   null,   '#e05', '#e05', null  ],
  ['#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05'],
  ['#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', '#e05'],
  [null,   '#e05', '#e05', '#e05', '#e05', '#e05', '#e05', null  ],
  [null,   null,   '#e05', '#e05', '#e05', '#e05', null,   null  ],
  [null,   null,   null,   '#e05', '#e05', null,   null,   null  ],
];

const STAR = [
  [null,   null,   '#fc0', null,   null  ],
  ['#fc0', null,   '#fc0', null,   '#fc0'],
  [null,   '#fc0', '#fc0', '#fc0', null  ],
  ['#fc0', '#fc0', '#fc0', '#fc0', '#fc0'],
  [null,   '#fc0', null,   '#fc0', null  ],
];

const DIAMOND = [
  [null,   null,   '#0ee', null,   null  ],
  [null,   '#0ee', '#0ee', '#0ee', null  ],
  ['#0ee', '#0ee', '#0ee', '#0ee', '#0ee'],
  [null,   '#0ee', '#0ee', '#0ee', null  ],
  [null,   null,   '#0ee', null,   null  ],
];

class Pixel {
  constructor(x, y, color, speed, delay, delayHide, step, boundSize) {
    this.x = x;
    this.y = y;

    this.color = color;
    this.speed = rand(0.1, 0.9) * speed;

    this.size = 0;
    this.sizeStep = rand(0, 0.5);
    this.minSize = 0.5;
    this.maxSizeAvailable = boundSize || 2;
    this.maxSize = rand(this.minSize, this.maxSizeAvailable);
    this.sizeDirection = 1;

    this.delay = delay;
    this.delayHide = delayHide;
    this.counter = 0;
    this.counterHide = 0;
    this.counterStep = step;

    this.isHidden = false;
    this.isFlicking = false;
  }

  draw = (ctx) => {
    const centerOffset = this.maxSizeAvailable * 0.5 - this.size * 0.5;

    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  show = () => {
    this.isHidden = false;
    this.counterHide = 0;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isFlicking = true;
    }

    if (this.isFlicking) {
      this.flicking();
    } else {
      this.size += this.sizeStep;
    }
  }

  hide = () => {
    this.counter = 0;

    if (this.counterHide <= this.delayHide) {
      this.counterHide += this.counterStep;
      if (this.isFlicking) {
        this.flicking();
      }
      return;
    }

    this.isFlicking = false;

    if (this.size <= 0) {
      this.size = 0;
      this.isHidden = true;
      return;
    } else {
      this.size -= 0.05;
    }
  }

  flicking = () => {
    if (this.size >= this.maxSize) {
      this.sizeDirection = -1;
    } else if (this.size <= this.minSize) {
      this.sizeDirection = 1;
    }

    this.size += this.sizeDirection * this.speed;
  }
}

class PixelPicture {
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

class Scene {
  #canvas;
  #ctx;
  #pictures;
  #mx;
  #my;
  #rafId;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#pictures = [];
    this.#mx = -1;
    this.#my = -1;
    this.#rafId = null;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener('mousemove', (e) => {
      this.#mx = e.clientX;
      this.#my = e.clientY;
    });
  }

  add(picture) {
    this.#pictures.push(picture);
    return this;
  }

  start() {
    if (this.#rafId !== null) return;
    const tick = () => {
      this.#rafId = requestAnimationFrame(tick);
      this.#tick();
    };
    this.#rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.#rafId === null) return;
    cancelAnimationFrame(this.#rafId);
    this.#rafId = null;
  }

  #tick() {
    const { width, height } = this.#canvas;
    this.#ctx.clearRect(0, 0, width, height);

    for (const picture of this.#pictures) {
      picture.drawGhost(this.#ctx);
      if (picture.isHovered(this.#mx, this.#my)) {
        picture.show();
      } else {
        picture.hide();
      }
      picture.draw(this.#ctx);
    }
  }
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');

  const scene = new Scene(canvas);

  scene
    .add(new PixelPicture(HEART,   40,  60, 10))
    .add(new PixelPicture(STAR,   200,  60,  9))
    .add(new PixelPicture(DIAMOND, 360, 60,  9));

  scene.start();
});
