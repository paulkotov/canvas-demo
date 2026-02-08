// import { Canvas } from './canvas.js';

const get = (obj, key, defaultValue) => {
    // if (!obj || !key in obj) {
    //     return defaultValue;
    // }
    if (obj  && key in obj) {
        return obj[key];
    }
    return defaultValue;
};

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

class Canvas {
    constructor(id, params = {}) {
        if (!id) {
            this.#createCanvas(params);
        } else {
            this.#getCanvas(id, params);
        }
        this.elements = [];
        this.originX = 0;
        this.originY = 0;
    }

    #createCanvas(params) {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = get(params, 'width', window.innerWidth);
        canvas.height = get(params, 'height', window.innerHeight);
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    #getCanvas(id, params) {
        const canvas = document.getElementById(id);
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    createElement(type, params) {
        let element;
        // fix to object
        switch (type) {
            case 'line':
                element = new Line(params);
                break;
            case 'circle':
                element = new Circle(params);
                break;
            case 'arc':
                element = new Arc(params);
                break;
            default:
                throw new Error('Unsupported element type');
        }
        this.elements.push(element);
        return element;
    }

    getElementById(id) {
        return this.elements.find(el => el.id === id);
    }

    appendElement(element) {
        this.elements.push(element);
        element.draw(this.context);
    }

    removeElement(element) {
        this.elements = this.elements.filter(el => el !== element);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.elements.forEach(element => element.draw(this.context));
    }
}

class Fractal {
    context = null;
    params = {};

    constructor(canvasRef, fractalParams) {
        if (!canvasRef) {
            throw Error('Error with accessing canvas');
        }
        this.width = canvasRef.width;
        this.height = canvasRef.height;
        const ctx = canvasRef.getContext('2d');
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;
        this.context = ctx;

        this.params.size = get(fractalParams, 'size', 300);
        this.params.sides = get(fractalParams, 'sides', 5);
        this.params.maxLevel = get(fractalParams, 'maxLevel', 2);
        this.params.scale = get(fractalParams, 'scale', 0.7);
        this.params.spread = get(fractalParams, 'spread', 0.5);
        this.params.branches = get(fractalParams, 'branches', 2);
        this.params.color = get(fractalParams, 'color', 'hsl(200, 100%, 50%)');
    }

    #drawBranch(level, maxLevel, spread, size) {
        if (level === undefined || level > maxLevel) {
            return;
        }
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(size / level, 0);
        this.context.stroke();

        for (let i = 0; i < this.params.branches; i++) {
            this.context.save();
            this.context.translate(this.params.size - (this.params.size / this.params.branches) * i, 0);
            this.context.rotate(spread);
            this.context.scale(this.params.scale, this.params.scale);
            this.#drawBranch(level + 1, maxLevel, spread, size);
            this.context.restore();

            this.context.save();
            this.context.translate(this.params.size - (this.params.size / this.params.branches) * i, 0);
            this.context.rotate(-spread);
            this.context.scale(this.params.scale, this.params.scale);
            this.#drawBranch(level + 1, maxLevel, spread, size);
            this.context.restore();
        }
    }

    drawFractal(position, scale, rotate) {
      this.context.strokeStyle = this.params.color;
      this.context.save();
      this.context.translate(
        get(position, 'x', this.width / 2),
        get(position, 'y', this.height / 2)
      );
      // this.context.scale(scale || 1, scale || 1);
      this.context.rotate(rotate || 0);
      for (let i = 0; i < this.params.sides; i++) {
          this.context.rotate((Math.PI * 2) / this.params.sides);
          this.#drawBranch(0, this.params.maxLevel, this.params.spread, this.params.size);
      }
      this.context.restore();
    }
}

window.addEventListener('load', function () {
    const canvas = new Canvas('canvas');
    // console.log(canvas);
    new Fractal(canvas.canvas).drawFractal({ x: 200, y: 200 }, 0.1);
    // const fractal = new Fractal(canvas.canvas, { size: 200, sides: 6, maxLevel: 4s, color: 'white' });
    // fractal.drawFractal({ x: 500, y: 500 }, 0.5, 0.2);
    // console.log(fractal);
    // fractal.draw();
});
