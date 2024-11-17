class Text {
    constructor({ x, y, content, font = '16px Arial', color = 'black' }) {
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
}

class Line {
    constructor({ startX, startY, endX, endY, color = 'black', lineWidth = 1 }) {
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
}

class Circle {
    constructor({ centerX, centerY, radius, color = 'black', fill = false }) {
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
}

class Arc {
    constructor({ centerX, centerY, radius, startAngle, endAngle, color = 'black', lineWidth = 1 }) {
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
}

class Rectangle {
    constructor({ x, y, width, height, color = 'black', fill = false }) {
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
}

class Ellipse {
    constructor({ x, y, radiusX, radiusY, rotation = 0, startAngle = 0, endAngle = 2 * Math.PI, color = 'black', fill = false }) {
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
}
