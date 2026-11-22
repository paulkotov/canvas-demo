export class PixelScene {
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
