/**
 * Global Canvas class for all drawing applications
 */

import { get } from './utils.js';

export class Canvas {
  constructor(id, params = {}) {
    if (!id) {
      this.#createCanvas(params);
    } else {
      this.#getCanvas(id, params);
    }
    this.elements = [];
    this.originX = 0;
    this.originY = 0;
    this.animationId = null;
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
      canvas.width = get(params, 'width', window.innerWidth);
      canvas.height = get(params, 'height', window.innerHeight);
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
    }
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
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

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.elements = [];
  }

  // Animation helpers
  startAnimation(callback) {
    const animate = () => {
      callback(this);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Resize handler
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Set context styles
  setStyles(styles = {}) {
    const ctx = this.context;
    if (styles.lineWidth) ctx.lineWidth = styles.lineWidth;
    if (styles.lineCap) ctx.lineCap = styles.lineCap;
    if (styles.strokeStyle) ctx.strokeStyle = styles.strokeStyle;
    if (styles.fillStyle) ctx.fillStyle = styles.fillStyle;
    if (styles.shadowColor) ctx.shadowColor = styles.shadowColor;
    if (styles.shadowBlur) ctx.shadowBlur = styles.shadowBlur;
    if (styles.shadowOffsetX) ctx.shadowOffsetX = styles.shadowOffsetX;
    if (styles.shadowOffsetY) ctx.shadowOffsetY = styles.shadowOffsetY;
    if (styles.globalAlpha) ctx.globalAlpha = styles.globalAlpha;
  }
}

// Make Canvas available globally
window.Canvas = Canvas;
