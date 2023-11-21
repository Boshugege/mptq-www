export class Color {
  hue: number;
  saturation: number;
  lightness: number;

  constructor(hue: number, saturation: number, lightness: number) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
  }

  lighten(lightness: number): Color {
    return new Color(this.hue, this.saturation, this.lightness + lightness);
  }

  hex(): string {
    const rgb = this.toRgb();

    return `#${rgb[0].toString(16).padStart(2, "0")}${rgb[1]
      .toString(16)
      .padStart(2, "0")}${rgb[2].toString(16).padStart(2, "0")}`;
  }

  toRgb(): number[] {
    const hue = this.hue / 360;
    const saturation = this.saturation / 100;
    const lightness = this.lightness / 100;

    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const huePrime = hue * 6;
    const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= huePrime && huePrime < 1) {
      r = chroma;
      g = secondComponent;
    } else if (1 <= huePrime && huePrime < 2) {
      r = secondComponent;
      g = chroma;
    } else if (2 <= huePrime && huePrime < 3) {
      g = chroma;
      b = secondComponent;
    } else if (3 <= huePrime && huePrime < 4) {
      g = secondComponent;
      b = chroma;
    } else if (4 <= huePrime && huePrime < 5) {
      r = secondComponent;
      b = chroma;
    } else if (5 <= huePrime && huePrime < 6) {
      r = chroma;
      b = secondComponent;
    }

    const lightnessAdjustment = lightness - chroma / 2;

    r += lightnessAdjustment;
    g += lightnessAdjustment;
    b += lightnessAdjustment;

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

export const generateColors = (
  N: number,
  baseColor = new Color(129, 100, 32),
): string[] => {
  const colors: string[] = [];

  // 生成N个颜色
  for (let i = 0; i < N; i++) {
    // 计算亮度调整值，使得颜色逐步变亮或变暗
    const lightnessAdjustment = (i / (N - 1)) * 20 - 10; // 可根据需要调整范围

    // 生成新颜色
    const newColor = baseColor.lighten(lightnessAdjustment);

    colors.push(newColor.hex());
  }

  return colors;
};
