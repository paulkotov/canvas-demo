# Pixel Sprites Design

**Date:** 2026-04-12  
**File:** `pixel-draw.html`

## Overview

Add picture-drawing logic to `pixel-draw.html` using the existing `Pixel` class. Multiple pixel-art sprites are placed on a shared canvas. Each sprite is always visible as a faint ghost; hovering a sprite causes its pixels to flicker up to full brightness. Moving away causes them to flicker back out.

## Data Format

Sprites are defined as 2D arrays of color strings. `null` means empty (transparent) cell.

```js
const HEART = [
  [null,  '#e05', '#e05', null,  null,  '#e05', '#e05', null ],
  ['#e05','#e05', '#e05','#e05','#e05', '#e05', '#e05','#e05'],
  ['#e05','#e05', '#e05','#e05','#e05', '#e05', '#e05','#e05'],
  [null,  '#e05', '#e05','#e05','#e05', '#e05', '#e05', null ],
  [null,  null,   '#e05','#e05','#e05', '#e05', null,   null ],
  [null,  null,   null,  '#e05','#e05', null,   null,   null ],
];
```

- Each row is a grid row; each non-null cell becomes one `Pixel` instance.
- `pixelSize` (pixels per cell, e.g. `10`) controls the scale of the sprite without changing the grid.
- Grid rows must all be the same length (rectangular).

## `PixelPicture` class

Owns a flat array of `Pixel` instances built from the non-null cells of the grid. Handles hit-testing and delegates animation control to individual pixels.

### Constructor

```js
new PixelPicture(grid, x, y, pixelSize, options = {})
```

- `grid` — 2D array as described above
- `x`, `y` — canvas offset of the top-left corner of the sprite (in canvas pixels)
- `pixelSize` — width/height of each cell in canvas pixels
- `options` — passed through to each `Pixel`: `{ speed, delay, delayHide, step, boundSize }`
  - `boundSize` defaults to `pixelSize`

### Pixel creation

For each cell `grid[row][col]` that is non-null, create:
```js
new Pixel(
  x + col * pixelSize,
  y + row * pixelSize,
  color,
  options.speed   ?? 0.5,
  options.delay   ?? 0,
  options.delayHide ?? 0,
  options.step    ?? 1,
  options.boundSize ?? pixelSize
)
```

### API

| Member | Description |
|---|---|
| `get bounds()` | Returns `{ x, y, w, h }` bounding box of the full sprite grid. `w = cols * pixelSize`, `h = rows * pixelSize`. |
| `isHovered(mx, my)` | AABB point-in-rect check using `bounds`. Returns `boolean`. |
| `show()` | Calls `pixel.show()` on every pixel. |
| `hide()` | Calls `pixel.hide()` on every pixel. |
| `drawGhost(ctx)` | Draws each pixel at full `pixelSize` with `ctx.globalAlpha = 0.12`. Gives the faint placeholder effect. |
| `draw(ctx)` | Calls `pixel.draw(ctx)` on every pixel (normal active/flickering draw). |

### Ghost rendering detail

`drawGhost` does not use `Pixel.draw()`. It directly draws a `fillRect` at the cell's full `pixelSize` dimensions with low alpha, so the ghost is stable and does not flicker:

```js
drawGhost(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (const { x, y, color } of this.#cells) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.#pixelSize, this.#pixelSize);
  }
  ctx.restore();
}
```

`#cells` is a flat array of `{ x, y, color }` built in the constructor during the same grid iteration that creates the `Pixel` instances. It holds the absolute canvas coordinates and color for each non-null cell, used exclusively by the ghost pass to avoid reading internal `Pixel` state.

## `Scene` class

Owns the canvas, the RAF loop, mouse tracking, and an ordered array of `PixelPicture` instances.

### Constructor

```js
new Scene(canvas)
```

- Resizes canvas to `window.innerWidth × window.innerHeight`.
- Attaches a `mousemove` listener on the canvas to track `{ mx, my }`.
- Initialises an empty `pictures` array and a null RAF handle.

### API

| Member | Description |
|---|---|
| `add(picture)` | Pushes a `PixelPicture` into `pictures`. Chainable (returns `this`). |
| `start()` | Starts the RAF loop. Idempotent — no-op if already running. |
| `stop()` | Cancels the RAF loop. |

### RAF tick (per frame)

```
clearRect(0, 0, canvas.width, canvas.height)

for each picture in pictures:
  picture.drawGhost(ctx)          // 1. stable ghost layer
  if picture.isHovered(mx, my):
    picture.show()
  else:
    picture.hide()
  picture.draw(ctx)               // 2. active/flickering pixels on top
```

Ghost is always drawn first. Active pixels are layered on top, so the ghost peeks through during the flicker — creating a "materialising from static" effect.

## Missing `rand` helper

The existing `Pixel` class uses a `rand(min, max)` helper that is not defined in `pixel-draw.html`. This must be added:

```js
function rand(min, max) {
  return min + Math.random() * (max - min);
}
```

## Wiring in `pixel-draw.html`

Inside the existing `window.addEventListener('load', () => { ... })` block:

```js
const canvas = document.getElementById('canvas');

const scene = new Scene(canvas);

scene
  .add(new PixelPicture(HEART,   40,  60, 10))
  .add(new PixelPicture(STAR,   200,  60,  9))
  .add(new PixelPicture(DIAMOND, 360, 60,  9));

scene.start();
```

## Sample sprite definitions

At minimum, three sprites ship with the implementation to demonstrate the scene:

- `HEART` — 8×6 red pixel heart
- `STAR` — 5×5 yellow star
- `DIAMOND` — 5×5 cyan diamond

## Visual behaviour summary

| State | Behaviour |
|---|---|
| Not hovered | Faint ghost at 12% alpha — stable, no animation |
| Hovered | Ghost still visible underneath; pixels flicker between `minSize` and `maxSize` at randomised speeds and delays |
| Leaving hover | Pixels shrink to 0 (Pixel.hide() logic), ghost remains |

## Out of scope

- Click / scroll triggers (design only covers hover)
- Text rendering (no bitmap font)
- Canvas resize handling
- More than one canvas per page
