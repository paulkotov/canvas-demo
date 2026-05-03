import { PixelScene } from './pixel-scene.js';
import { PixelPicture, HEART, STAR, DIAMOND } from './pixel-picture.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const scene = new PixelScene(canvas);

  scene
    .add(new PixelPicture(HEART,   40,  60, 10))
    .add(new PixelPicture(STAR,   200,  60,  9))
    .add(new PixelPicture(DIAMOND, 360, 60,  9));

  scene.start();
});
