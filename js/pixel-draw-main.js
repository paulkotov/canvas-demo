import { PixelScene } from './pixel-scene.js';
import { PixelPicture, HEART, STAR, DIAMOND, MUSHROOM, CROWN, TREE, ROCKET, LIGHTNING } from './pixel-picture.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const scene = new PixelScene(canvas);

  scene
    .add(new PixelPicture(HEART,     40,  60, 10))
    .add(new PixelPicture(STAR,     200,  60,  9))
    .add(new PixelPicture(DIAMOND,  360,  60,  9))
    .add(new PixelPicture(MUSHROOM,  40, 200, 10))
    .add(new PixelPicture(CROWN,    185, 200, 10))
    .add(new PixelPicture(TREE,     340, 200,  9))
    .add(new PixelPicture(ROCKET,   490, 200, 12))
    .add(new PixelPicture(LIGHTNING, 580, 200, 12));

  scene.start();
});
