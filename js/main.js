import { Canvas } from './canvas.js';
import { Fractal, getRandomFractalParams } from './fractal.js';

window.addEventListener('load', function () {
  const canvas = new Canvas('canvas');
  const form = document.querySelector('form[name="controls__form"]');
  const drawBtn = document.getElementById('drawBtn');
  const inputs = form.querySelectorAll('input[type="number"]');

  const branchesInput = form.querySelector('input[name="branches"]');
  const spreadInput = form.querySelector('input[name="spread"]');
  const sidesInput = form.querySelector('input[name="sides"]');
  const angleInput = form.querySelector('input[name="angle"]');
  const scaleInput = form.querySelector('input[name="scale"]');
  const twistInput = form.querySelector('input[name="twist"]');

  function updateDrawButton() {
    const allFilled = Array.from(inputs).every(input => input.value !== '');
    drawBtn.disabled = !allFilled;
  }

  inputs.forEach(input => input.addEventListener('input', updateDrawButton));
  updateDrawButton();

  let snowflakeTimerId = null;

  const stopSnowflakes = () => {
    if (snowflakeTimerId !== null) {
      clearInterval(snowflakeTimerId);
      snowflakeTimerId = null;
    }
  };

  const getSnowflakeParams = () => ({
    baseHue: Math.floor(Math.random() * 360),
    branches: Math.floor(Math.random() * 3) + 4,
    spread: +(0.3 + Math.random() * 0.6).toFixed(2),
    scale: +(0.4 + Math.random() * 0.2).toFixed(2),
    size: 6 + Math.floor(Math.random() * 7),
    maxLevel: 2,
    lineWidth: 1,
    shadowBlur: 3,
    shadowColor: 'rgba(180, 220, 255, 0.6)',
  });

  const spawnSnowflake = () => {
    const x = Math.random() * canvas.canvas.width;
    const y = Math.random() * canvas.canvas.height;
    const params = getSnowflakeParams();
    const rotation = Math.random() * Math.PI * 2;
    new Fractal(canvas.canvas, params).draw({ x, y }, 1, rotation);
  };

  const centerPosition = () => ({
    x: canvas.canvas.width / 2,
    y: canvas.canvas.height / 2,
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    stopSnowflakes();
    const rotation = -angleInput.value * Math.PI / 180;
    new Fractal(canvas.canvas, {
      baseHue: 60,
      branches: branchesInput.value,
      spread: spreadInput.value,
      sides: sidesInput.value,
      scale: scaleInput.value,
      twist: twistInput.value,
      maxLevel: 3,
    }).draw(centerPosition(), 1, rotation);
  });

  form.addEventListener('reset', function (e) {
    e.preventDefault();
    stopSnowflakes();
    branchesInput.value = '';
    spreadInput.value = '';
    sidesInput.value = '';
    angleInput.value = '';
    scaleInput.value = '';
    twistInput.value = '0';
    canvas.clear();
    updateDrawButton();
  });

  document.getElementById('randomFractal').addEventListener('click', function () {
    stopSnowflakes();
    const randomParams = getRandomFractalParams();
    branchesInput.value = randomParams.branches;
    spreadInput.value = randomParams.spread;
    sidesInput.value = randomParams.sides;
    scaleInput.value = randomParams.scale;
    angleInput.value = randomParams.angle;
    twistInput.value = randomParams.twist;
    updateDrawButton();

    canvas.clear();
    const rotation = -randomParams.angle * Math.PI / 180;
    new Fractal(canvas.canvas, {
      baseHue: randomParams.baseHue,
      branches: randomParams.branches,
      spread: randomParams.spread,
      sides: randomParams.sides,
      scale: randomParams.scale,
      twist: randomParams.twist,
      maxLevel: 3,
    }).draw(centerPosition(), 1, rotation);
  });

  document.getElementById('snowflakes').addEventListener('click', function () {
    stopSnowflakes();
    canvas.clear();
    spawnSnowflake();
    snowflakeTimerId = setInterval(spawnSnowflake, 250);
  });

  window.addEventListener('resize', () => canvas.resize());
});
