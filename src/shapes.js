class Line {
    constructor({ startX, startY, endX, endY, color = 'black', lineWidth = 1 }) {
        this.id = generateId();
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    setLineWidth(width) {
        this.lineWidth = width;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
    }

    toJSON() {
        return JSON.stringify({
            type: 'Line',
            startX: this.startX,
            startY: this.startY,
            endX: this.endX,
            endY: this.endY,
            color: this.color,
            lineWidth: this.lineWidth
        });
    }
}

class Circle {
    constructor({ centerX, centerY, radius, color = 'black', fill = false }) {
        this.id = generateId();
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
        this.fill = fill;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        context.strokeStyle = this.color;
        if (this.fill) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.stroke();
        }
    }

    toJSON() {
        return JSON.stringify({
            type: 'Circle',
            centerX: this.centerX,
            centerY: this.centerY,
            radius: this.radius,
            color: this.color,
            fill: this.fill
        });
    }
}

class Arc {
    constructor({ centerX, centerY, radius, startAngle, endAngle, color = 'black', lineWidth = 1 }) {
        this.id = generateId();
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle);
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
    }

    toJSON() {
        return JSON.stringify({
            type: 'Arc',
            centerX: this.centerX,
            centerY: this.centerY,
            radius: this.radius,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            color: this.color,
            lineWidth: this.lineWidth
        });
    }
}

class Text {
    constructor({ x, y, content, font = '16px Arial', color = 'black' }) {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.content = content;
        this.font = font;
        this.color = color;
    }

    setFontSize(size) {
        const fontParts = this.font.split(' ');
        fontParts[0] = `${size}px`;
        this.font = fontParts.join(' ');
    }

    setColor(color) {
        this.color = color;
    }

    draw(context) {
        context.font = this.font;
        context.fillStyle = this.color;
        context.fillText(this.content, this.x, this.y);
    }

    toJSON() {
        return JSON.stringify({
            type: 'Text',
            x: this.x,
            y: this.y,
            content: this.content,
            font: this.font,
            color: this.color
        });
    }
}

class Rectangle {
    constructor({ x, y, width, height, color = 'black', fill = false }) {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.fill = fill;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.strokeStyle = this.color;
        if (this.fill) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.stroke();
        }
    }

    toJSON() {
        return JSON.stringify({
            type: 'Rectangle',
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color,
            fill: this.fill
        });
    }
}

class Ellipse {
    constructor({ x, y, radiusX, radiusY, rotation = 0, startAngle = 0, endAngle = 2 * Math.PI, color = 'black', fill = false }) {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.color = color;
        this.fill = fill;
    }

    draw(context) {
        context.beginPath();
        context.ellipse(this.x, this.y, this.radiusX, this.radiusY, this.rotation, this.startAngle, this.endAngle);
        context.strokeStyle = this.color;
        if (this.fill) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.stroke();
        }
    }

    toJSON() {
        return JSON.stringify({
            type: 'Ellipse',
            x: this.x,
            y: this.y,
            radiusX: this.radiusX,
            radiusY: this.radiusY,
            rotation: this.rotation,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            color: this.color,
            fill: this.fill
        });
    }
}

class CanvasImage {
    constructor({ src, x, y, width, height }) {
        this.id = generateId();
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = this.src;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    toJSON() {
        return JSON.stringify({
            type: 'CanvasImage',
            src: this.src,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }
}

class Polygon {
    constructor({ vertices, color = 'black', fill = false }) {
        this.id = generateId();
        this.id = generateId();
        this.vertices = vertices;
        this.color = color;
        this.fill = fill;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        context.closePath();
        context.strokeStyle = this.color;
        if (this.fill) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.stroke();
        }
    }

    toJSON() {
        return JSON.stringify({
            id: this.id,
            type: 'Polygon',
            vertices: this.vertices,
            color: this.color,
            fill: this.fill
        });
    }
}
