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
