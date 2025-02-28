const get = (obj, key, defaultValue) => {
  if (!obj) {
    return defaultValue;
  }
  if (key in obj) {
    return obj[key];
  }
  return defaultValue;
};

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

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
    if (!canvas) {
      this.#createCanvas(params);
    } else {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
    }
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

  getElementById(id) {
    return this.elements.find(el => el.id === id);
  }

  appendChild(element) {
    this.elements.push(element);
    element.draw(this.context);
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.elements.forEach(element => element.draw(this.context));
  }
}