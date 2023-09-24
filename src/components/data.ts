// 表达式数据
const exprData = ['null', 'undefined', 'false', 'Boolean\n(false)', '[]', '[[]]', '""', 'String\n("")', '0', 'Number\n(0)', '"0"', 'String\n("0")', '[0]', 'true', 'Boolean\n(true)', '1', 'Number\n(1)', '"1"', 'String\n("1")', '[1]', '-1', 'Number\n(-1)', '"-1"', 'String\n("-1")', '[-1]'];

const exprColor = exprData.map(getRandomColor)


// 获取随机的颜色
function getRandomColor() {
  // 生成低饱和度的浅彩色十六进制
  // 色调 0~1
  // 饱和度 0.5~1
  // 亮度 0.8~0.95
  let hue = Math.random();
  let saturation = Math.random() * 0.5 + 0.5;
  let lightness = Math.random() * 0.15 + 0.8;
  let rgb = hslToRgb(hue, saturation, lightness);
  return '#' + rgbToHex(rgb[0]) + rgbToHex(rgb[1]) + rgbToHex(rgb[2]);
}
// HSL转RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
// RGB转十六进制
function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

// 获取随机的表达式和颜色
export function getRandomData() {
  let r = Math.floor(Math.random() * exprData.length);
  let data = exprData[r];
  let color = exprColor[r];
  return [data, color];
}
