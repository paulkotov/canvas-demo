import { Shape } from "./shapes";

type TCanvasInitialParams = {
  width: number;
  height: number;
}

export class Canvas {
  elements: any;
  originX: number;
  originY: number;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D | null;

  constructor(id: string, params = {}) {
    if (!id) {
      this.#createCanvas(params);
    } else {
      this.#getCanvas(id);
    }
    this.elements = [];
    this.originX = 0;
    this.originY = 0;
  }

  #createCanvas(params: TCanvasInitialParams) {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = get(params, 'width', window.innerWidth);
    canvas.height = get(params, 'height', window.innerHeight);
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  #getCanvas(id: string) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id ${id} not found`);
    }
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  createElement(type, params) {
    let element;
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

  removeElement(element) {
    this.elements = this.elements.filter(el => el !== element);
  }

  getElementById(id: string) {
    return this.elements.find(el => el.id === id);
  }

  appendElement(element: Shape) {
    this.elements.push(element);
    element.draw(this.context);
  }

  draw() {
    if (!this.context) {
      throw new Error('Canvas context not initialized');
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.elements.forEach(element => element.draw(this.context));
  }
}