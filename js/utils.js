/**
 * Shared utility functions
 */

export const get = (obj, key, defaultValue) => {
  if (!obj) {
    return defaultValue;
  }
  if (key in obj) {
    return obj[key];
  }
  return defaultValue;
};

export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const rand = (min, max) => Math.random() * (max - min) + min;

export const randInt = (min, max) => Math.floor(rand(min, max + 1));

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, t) => start + (end - start) * t;

export const map = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const degToRad = (deg) => deg * (Math.PI / 180);

export const radToDeg = (rad) => rad * (180 / Math.PI);

export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// HSL color helpers
export const hslToString = (h, s, l, a = 1) => {
  return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};

export const randomColor = () => {
  return hslToString(randInt(0, 360), randInt(50, 100), randInt(40, 60));
};
