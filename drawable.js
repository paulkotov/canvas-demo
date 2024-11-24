class Drawable {
    constructor({x, y, width, height, color = 'black', stroke = 'none', visible = true, type}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.stroke = stroke;
        this.visible = visible; // Default to visible
        this.type = type
    }

    draw(context) {
        if (!this.visible) return; // Do not draw if not visible

        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

        if (this.stroke !== 'none') {
            context.strokeStyle = this.stroke;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setVisibility(isVisible) {
        this.visible = isVisible;
    }
}
