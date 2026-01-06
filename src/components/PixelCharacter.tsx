// PixelCharacter.tsx
import React from "react";

type PixelCharacterProps = {
  size?: number;
  name?: string | null;
};

function stringToHexColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

type AdjustMode = "neutral" | "deep";

function adjustColorForContrast(
  hex: string,
  mode: AdjustMode = "neutral"
): string {
  const cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length !== 6) {
    throw new Error(
      "Invalid HEX color format. Expected 6-digit hex (e.g. #ec962f)."
    );
  }

  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Определяем, светлый ли цвет
  const isLight = l > 0.55;

  let newH = h;
  let newS = s;
  let newL = l;

  if (mode === "neutral") {
    // Режим 1: как раньше — без сдвига тона
    if (isLight) {
      newL = Math.max(0.2, l * 0.6);
      newS = Math.max(0.2, s * 0.6);
    } else {
      newL = Math.min(0.8, l * 1.4);
      newS = Math.min(0.9, s * 0.8);
    }
  } else if (mode === "deep") {
    // Режим 2: "огненный" — сдвиг к красному + затемнение
    if (isLight) {
      // Сдвигаем оттенок к ~10° (красно-оранжевый), но мягко — не дальше 0.03 (≈10°)
      newH = Math.max(0.0, h - 0.05); // уменьшаем hue (оранжевый → красный)
      newL = Math.max(0.15, l * 0.4); // сильнее затемняем
      newS = Math.min(1.0, s * 1.2); // чуть повышаем насыщенность
    } else {
      // Если исходный цвет и так тёмный — не делаем его ещё темнее
      // Вместо этого: слегка осветляем + добавляем красный оттенок
      newH = Math.max(0.0, h - 0.07);
      newL = Math.min(0.4, l * 1.3);
      newS = Math.min(1.0, s * 1.1);
    }
  }

  // HSL → RGB
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let newR: number, newG: number, newB: number;

  if (newS === 0) {
    newR = newG = newB = newL;
  } else {
    const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS;
    const p = 2 * newL - q;
    newR = hue2rgb(p, q, newH + 1 / 3);
    newG = hue2rgb(p, q, newH);
    newB = hue2rgb(p, q, newH - 1 / 3);
  }

  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

const PixelCharacter: React.FC<PixelCharacterProps> = ({ size, name }) => {
  const hairColor = name ? stringToHexColor(name) : "#ec962f";
  const hairSecondaryColor = adjustColorForContrast(hairColor);
  const hairTertiaryColor = adjustColorForContrast(hairColor, "deep");
  return (
    <div>
      <svg
        width={size || "480"}
        height={size || "480"}
        viewBox="0 0 480 480"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="210" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="220" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="230" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="200" y="40" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="200" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="180" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="190" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="240" y="40" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="250" y="40" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="240" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="270" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="270" y="20" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="260" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="280" y="30" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="280" y="40" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="280" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="290" y="50" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="280" y="60" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="300" y="60" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="310" y="70" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="320" y="80" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="170" y="60" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="160" y="60" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="150" y="70" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="150" y="80" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="140" y="90" width="10" height="10" fill={hairSecondaryColor} />
        <rect
          x="140"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect x="220" y="40" width="10" height="10" fill={hairColor} />
        <rect x="210" y="40" width="10" height="10" fill={hairColor} />
        <rect x="230" y="40" width="10" height="10" fill={hairColor} />
        <rect x="230" y="50" width="10" height="10" fill={hairColor} />
        <rect x="220" y="50" width="10" height="10" fill={hairColor} />
        <rect x="210" y="50" width="10" height="10" fill={hairColor} />
        <rect x="210" y="60" width="10" height="10" fill={hairColor} />
        <rect x="220" y="60" width="10" height="10" fill={hairColor} />
        <rect x="230" y="60" width="10" height="10" fill={hairColor} />
        <rect x="240" y="60" width="10" height="10" fill={hairColor} />
        <rect x="250" y="60" width="10" height="10" fill={hairColor} />
        <rect x="260" y="60" width="10" height="10" fill={hairColor} />
        <rect x="270" y="60" width="10" height="10" fill={hairColor} />
        <rect x="270" y="50" width="10" height="10" fill={hairColor} />
        <rect x="260" y="50" width="10" height="10" fill={hairColor} />
        <rect x="250" y="50" width="10" height="10" fill={hairColor} />
        <rect x="270" y="40" width="10" height="10" fill={hairColor} />
        <rect x="260" y="40" width="10" height="10" fill={hairColor} />
        <rect x="180" y="60" width="10" height="10" fill={hairColor} />
        <rect x="190" y="60" width="10" height="10" fill={hairColor} />
        <rect x="200" y="60" width="10" height="10" fill={hairColor} />
        <rect x="200" y="70" width="10" height="10" fill={hairColor} />
        <rect x="190" y="70" width="10" height="10" fill={hairColor} />
        <rect x="180" y="70" width="10" height="10" fill={hairColor} />
        <rect x="170" y="70" width="10" height="10" fill={hairColor} />
        <rect x="160" y="70" width="10" height="10" fill={hairColor} />
        <rect x="160" y="80" width="10" height="10" fill={hairColor} />
        <rect x="160" y="90" width="10" height="10" fill={hairColor} />
        <rect x="150" y="90" width="10" height="10" fill={hairColor} />
        <rect x="150" y="100" width="10" height="10" fill={hairColor} />
        <rect x="160" y="100" width="10" height="10" fill={hairColor} />
        <rect x="170" y="100" width="10" height="10" fill={hairColor} />
        <rect x="180" y="100" width="10" height="10" fill={hairColor} />
        <rect x="190" y="100" width="10" height="10" fill={hairColor} />
        <rect x="170" y="90" width="10" height="10" fill={hairColor} />
        <rect x="180" y="90" width="10" height="10" fill={hairColor} />
        <rect x="190" y="90" width="10" height="10" fill={hairColor} />
        <rect x="200" y="90" width="10" height="10" fill={hairColor} />
        <rect x="170" y="80" width="10" height="10" fill={hairColor} />
        <rect x="180" y="80" width="10" height="10" fill={hairColor} />
        <rect x="190" y="80" width="10" height="10" fill={hairColor} />
        <rect x="200" y="80" width="10" height="10" fill={hairColor} />
        <rect x="210" y="80" width="10" height="10" fill={hairColor} />
        <rect x="220" y="80" width="10" height="10" fill={hairColor} />
        <rect x="210" y="70" width="10" height="10" fill={hairColor} />
        <rect x="220" y="70" width="10" height="10" fill={hairColor} />
        <rect x="230" y="70" width="10" height="10" fill={hairColor} />
        <rect x="240" y="70" width="10" height="10" fill={hairColor} />
        <rect x="250" y="70" width="10" height="10" fill={hairColor} />
        <rect x="260" y="70" width="10" height="10" fill={hairColor} />
        <rect x="270" y="70" width="10" height="10" fill={hairColor} />
        <rect x="280" y="70" width="10" height="10" fill={hairColor} />
        <rect x="290" y="70" width="10" height="10" fill={hairColor} />
        <rect x="290" y="80" width="10" height="10" fill={hairColor} />
        <rect x="280" y="80" width="10" height="10" fill={hairColor} />
        <rect x="270" y="80" width="10" height="10" fill={hairColor} />
        <rect x="260" y="80" width="10" height="10" fill={hairColor} />
        <rect x="250" y="80" width="10" height="10" fill={hairColor} />
        <rect x="240" y="80" width="10" height="10" fill={hairColor} />
        <rect x="230" y="80" width="10" height="10" fill={hairColor} />
        <rect x="290" y="60" width="10" height="10" fill={hairColor} />
        <rect x="300" y="70" width="10" height="10" fill={hairColor} />
        <rect x="300" y="80" width="10" height="10" fill={hairColor} />
        <rect x="310" y="80" width="10" height="10" fill={hairColor} />
        <rect x="310" y="90" width="10" height="10" fill={hairColor} />
        <rect x="320" y="90" width="10" height="10" fill={hairColor} />
        <rect x="170" y="110" width="10" height="10" fill={hairColor} />
        <rect x="180" y="110" width="10" height="10" fill={hairColor} />
        <rect x="220" y="90" width="10" height="10" fill={hairColor} />
        <rect x="230" y="90" width="10" height="10" fill={hairColor} />
        <rect x="240" y="90" width="10" height="10" fill={hairColor} />
        <rect x="250" y="90" width="10" height="10" fill={hairColor} />
        <rect x="230" y="100" width="10" height="10" fill={hairColor} />
        <rect x="220" y="100" width="10" height="10" fill={hairColor} />
        <rect x="210" y="100" width="10" height="10" fill={hairColor} />
        <rect x="210" y="110" width="10" height="10" fill={hairColor} />
        <rect x="220" y="110" width="10" height="10" fill={hairColor} />
        <rect x="230" y="110" width="10" height="10" fill={hairColor} />
        <rect x="240" y="100" width="10" height="10" fill={hairColor} />
        <rect x="280" y="90" width="10" height="10" fill={hairColor} />
        <rect x="290" y="100" width="10" height="10" fill={hairColor} />
        <rect x="290" y="90" width="10" height="10" fill={hairColor} />
        <rect x="290" y="110" width="10" height="10" fill={hairColor} />
        <rect x="300" y="90" width="10" height="10" fill={hairSecondaryColor} />
        <rect
          x="300"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="310"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="320"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="310"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="310"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="300"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="300"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="290"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="290"
          y="130"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect x="210" y="90" width="10" height="10" fill={hairSecondaryColor} />
        <rect
          x="200"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="200"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="190"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="180"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="170"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="160"
          y="120"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="160"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="150"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="180"
          y="140"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="190"
          y="140"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="190"
          y="150"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="180"
          y="150"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="240"
          y="110"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect
          x="250"
          y="100"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect x="260" y="90" width="10" height="10" fill={hairSecondaryColor} />
        <rect x="270" y="90" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="100" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="110" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="120" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="300" y="130" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="300" y="140" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="290" y="140" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="290" y="150" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="160" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="180" y="160" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="190" y="160" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="190" y="170" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="200" y="170" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="170" y="160" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="170" y="150" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="170" y="140" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="160" y="140" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="160" y="150" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="200" y="180" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="140" y="120" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="140" y="110" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="150" y="120" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="150" y="130" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="160" y="130" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="170" y="130" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="260" y="180" width="10" height="10" fill={"#711301"} />
        <rect x="250" y="180" width="10" height="10" fill={"#711301"} />
        <rect x="240" y="180" width="10" height="10" fill={"#711301"} />
        <rect x="230" y="180" width="10" height="10" fill={"#711301"} />
        <rect
          x="180"
          y="130"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect x="240" y="130" width="10" height="10" fill="#c47a65" />
        <rect x="240" y="120" width="10" height="10" fill="#c47a65" />
        <rect x="270" y="100" width="10" height="10" fill="#c47a65" />
        <rect x="260" y="100" width="10" height="10" fill="#c47a65" />
        <rect x="270" y="110" width="10" height="10" fill="#c47a65" />
        <rect x="270" y="120" width="10" height="10" fill="#c47a65" />
        <rect x="210" y="180" width="10" height="10" fill="#c47a65" />
        <rect x="220" y="180" width="10" height="10" fill="#c47a65" />
        <rect x="240" y="170" width="10" height="10" fill="#c47a65" />
        <rect x="210" y="170" width="10" height="10" fill="#f0bda0" />
        <rect x="220" y="170" width="10" height="10" fill="#f0bda0" />
        <rect x="230" y="170" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="170" width="10" height="10" fill="#f0bda0" />
        <rect x="260" y="170" width="10" height="10" fill="#f0bda0" />
        <rect x="270" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="210" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="220" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="230" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="240" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="260" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="200" y="160" width="10" height="10" fill="#f0bda0" />
        <rect x="240" y="140" width="10" height="10" fill="#f0bda0" />
        <rect x="240" y="150" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="110" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="120" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="130" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="140" width="10" height="10" fill="#f0bda0" />
        <rect x="250" y="150" width="10" height="10" fill="#f0bda0" />
        <rect x="260" y="110" width="10" height="10" fill="#f0bda0" />
        <rect x="260" y="120" width="10" height="10" fill="#f0bda0" />
        <rect x="200" y="140" width="10" height="10" fill="#faeddf" />
        <rect x="210" y="140" width="10" height="10" fill="#faeddf" />
        <rect x="220" y="140" width="10" height="10" fill="#faeddf" />
        <rect x="200" y="150" width="10" height="10" fill="#faeddf" />
        <rect x="210" y="150" width="10" height="10" fill="#faeddf" />
        <rect x="220" y="150" width="10" height="10" fill="#faeddf" />
        <rect x="200" y="120" width="10" height="10" fill="#360d10" />
        <rect x="190" y="120" width="10" height="10" fill="#360d10" />
        <rect x="210" y="120" width="10" height="10" fill="#360d10" />
        <rect x="230" y="120" width="10" height="10" fill="#360d10" />
        <rect x="220" y="120" width="10" height="10" fill="#360d10" />
        <rect x="230" y="150" width="10" height="10" fill="#7d301e" />
        <rect x="230" y="140" width="10" height="10" fill="#7d301e" />
        <rect x="210" y="130" width="10" height="10" fill="#f5e9dc" />
        <rect x="200" y="130" width="10" height="10" fill="#f5e9dc" />
        <rect x="220" y="130" width="10" height="10" fill="#f5e9dc" />
        <rect
          x="190"
          y="130"
          width="10"
          height="10"
          fill={hairSecondaryColor}
        />
        <rect x="230" y="130" width="10" height="10" fill="#893628" />
        <rect x="280" y="140" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="150" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="280" y="130" width="10" height="10" fill={hairTertiaryColor} />
        <rect x="260" y="150" width="10" height="10" fill="#f0bc9c" />
        <rect x="260" y="140" width="10" height="10" fill="#f0bc9c" />
        <rect x="260" y="130" width="10" height="10" fill="#f0bc9c" />
        <rect x="270" y="130" width="10" height="10" fill="#f0bc9c" />
        <rect x="270" y="140" width="10" height="10" fill="#781209" />
        <rect x="270" y="150" width="10" height="10" fill="#781209" />
        <rect x="270" y="180" width="10" height="10" fill="#260f12" />
        <rect x="280" y="190" width="10" height="10" fill="#260f12" />
        <rect x="290" y="190" width="10" height="10" fill="#260f12" />
        <rect x="300" y="200" width="10" height="10" fill="#260f12" />
        <rect x="300" y="210" width="10" height="10" fill="#260f12" />
        <rect x="310" y="220" width="10" height="10" fill="#260f12" />
        <rect x="310" y="230" width="10" height="10" fill="#260f12" />
        <rect x="300" y="230" width="10" height="10" fill="#260f12" />
        <rect x="290" y="230" width="10" height="10" fill="#260f12" />
        <rect x="300" y="240" width="10" height="10" fill="#260f12" />
        <rect x="310" y="250" width="10" height="10" fill="#260f12" />
        <rect x="310" y="260" width="10" height="10" fill="#260f12" />
        <rect x="320" y="270" width="10" height="10" fill="#260f12" />
        <rect x="270" y="190" width="10" height="10" fill="#260f12" />
        <rect x="260" y="190" width="10" height="10" fill="#260f12" />
        <rect x="250" y="190" width="10" height="10" fill="#260f12" />
        <rect x="270" y="200" width="10" height="10" fill="#260f12" />
        <rect x="180" y="170" width="10" height="10" fill="#260f12" />
        <rect x="190" y="180" width="10" height="10" fill="#260f12" />
        <rect x="180" y="190" width="10" height="10" fill="#260f12" />
        <rect x="190" y="190" width="10" height="10" fill="#260f12" />
        <rect x="200" y="190" width="10" height="10" fill="#260f12" />
        <rect x="120" y="240" width="10" height="10" fill="#260f12" />
        <rect x="130" y="230" width="10" height="10" fill="#260f12" />
        <rect x="140" y="220" width="10" height="10" fill="#260f12" />
        <rect x="250" y="220" width="10" height="10" fill="#260f12" />
        <rect x="260" y="220" width="10" height="10" fill="#260f12" />
        <rect x="270" y="220" width="10" height="10" fill="#260f12" />
        <rect x="280" y="220" width="10" height="10" fill="#260f12" />
        <rect x="280" y="230" width="10" height="10" fill="#260f12" />
        <rect x="280" y="240" width="10" height="10" fill="#260f12" />
        <rect x="280" y="250" width="10" height="10" fill="#260f12" />
        <rect x="280" y="260" width="10" height="10" fill="#260f12" />
        <rect x="280" y="270" width="10" height="10" fill="#260f12" />
        <rect x="290" y="280" width="10" height="10" fill="#260f12" />
        <rect x="290" y="270" width="10" height="10" fill="#260f12" />
        <rect x="290" y="290" width="10" height="10" fill="#260f12" />
        <rect x="280" y="280" width="10" height="10" fill="#260f12" />
        <rect x="280" y="300" width="10" height="10" fill="#260f12" />
        <rect x="210" y="310" width="10" height="10" fill="#260f12" />
        <rect x="220" y="310" width="10" height="10" fill="#260f12" />
        <rect x="230" y="310" width="10" height="10" fill="#260f12" />
        <rect x="240" y="310" width="10" height="10" fill="#260f12" />
        <rect x="250" y="310" width="10" height="10" fill="#260f12" />
        <rect x="260" y="310" width="10" height="10" fill="#260f12" />
        <rect x="270" y="310" width="10" height="10" fill="#260f12" />
        <rect x="250" y="330" width="10" height="10" fill="#260f12" />
        <rect x="240" y="330" width="10" height="10" fill="#260f12" />
        <rect x="240" y="340" width="10" height="10" fill="#260f12" />
        <rect x="240" y="350" width="10" height="10" fill="#260f12" />
        <rect x="250" y="350" width="10" height="10" fill="#260f12" />
        <rect x="230" y="370" width="10" height="10" fill="#260f12" />
        <rect x="220" y="380" width="10" height="10" fill="#260f12" />
        <rect x="220" y="390" width="10" height="10" fill="#260f12" />
        <rect x="220" y="400" width="10" height="10" fill="#260f12" />
        <rect x="220" y="410" width="10" height="10" fill="#260f12" />
        <rect x="160" y="410" width="10" height="10" fill="#260f12" />
        <rect x="170" y="400" width="10" height="10" fill="#260f12" />
        <rect x="170" y="390" width="10" height="10" fill="#260f12" />
        <rect x="170" y="380" width="10" height="10" fill="#260f12" />
        <rect x="290" y="410" width="10" height="10" fill="#260f12" />
        <rect x="290" y="400" width="10" height="10" fill="#260f12" />
        <rect x="290" y="390" width="10" height="10" fill="#260f12" />
        <rect x="300" y="380" width="10" height="10" fill="#260f12" />
        <rect x="250" y="250" width="10" height="10" fill="#260f12" />
        <rect x="260" y="250" width="10" height="10" fill="#260f12" />
        <rect x="270" y="250" width="10" height="10" fill="#260f12" />
        <rect x="250" y="260" width="10" height="10" fill="#260f12" />
        <rect x="260" y="260" width="10" height="10" fill="#260f12" />
        <rect x="270" y="260" width="10" height="10" fill="#260f12" />
        <rect x="270" y="270" width="10" height="10" fill="#260f12" />
        <rect x="270" y="280" width="10" height="10" fill="#260f12" />
        <rect x="260" y="270" width="10" height="10" fill="#260f12" />
        <rect x="250" y="270" width="10" height="10" fill="#260f12" />
        <rect x="250" y="280" width="10" height="10" fill="#260f12" />
        <rect x="260" y="280" width="10" height="10" fill="#260f12" />
        <rect x="270" y="290" width="10" height="10" fill="#260f12" />
        <rect x="260" y="290" width="10" height="10" fill="#260f12" />
        <rect x="250" y="290" width="10" height="10" fill="#260f12" />
        <rect x="230" y="290" width="10" height="10" fill="#260f12" />
        <rect x="240" y="290" width="10" height="10" fill="#260f12" />
        <rect x="220" y="290" width="10" height="10" fill="#260f12" />
        <rect x="220" y="280" width="10" height="10" fill="#260f12" />
        <rect x="230" y="280" width="10" height="10" fill="#260f12" />
        <rect x="240" y="280" width="10" height="10" fill="#260f12" />
        <rect x="130" y="250" width="10" height="10" fill="#260f12" />
        <rect x="130" y="260" width="10" height="10" fill="#260f12" />
        <rect x="130" y="270" width="10" height="10" fill="#260f12" />
        <rect x="150" y="250" width="10" height="10" fill="#260f12" />
        <rect x="160" y="240" width="10" height="10" fill="#260f12" />
        <rect x="140" y="250" width="10" height="10" fill="#260f12" />
        <rect x="170" y="220" width="10" height="10" fill="#260f12" />
        <rect x="170" y="230" width="10" height="10" fill="#260f12" />
        <rect x="170" y="240" width="10" height="10" fill="#260f12" />
        <rect x="170" y="250" width="10" height="10" fill="#260f12" />
        <rect x="170" y="260" width="10" height="10" fill="#260f12" />
        <rect x="160" y="280" width="10" height="10" fill="#260f12" />
        <rect x="160" y="270" width="10" height="10" fill="#260f12" />
        <rect x="180" y="260" width="10" height="10" fill="#260f12" />
        <rect x="180" y="270" width="10" height="10" fill="#260f12" />
        <rect x="180" y="280" width="10" height="10" fill="#260f12" />
        <rect x="180" y="290" width="10" height="10" fill="#260f12" />
        <rect x="180" y="300" width="10" height="10" fill="#260f12" />
        <rect x="190" y="300" width="10" height="10" fill="#260f12" />
        <rect x="200" y="310" width="10" height="10" fill="#260f12" />
        <rect x="150" y="190" width="10" height="10" fill="#433a36" />
        <rect x="160" y="190" width="10" height="10" fill="#433a36" />
        <rect x="170" y="190" width="10" height="10" fill="#433a36" />
        <rect x="140" y="200" width="10" height="10" fill="#433a36" />
        <rect x="140" y="210" width="10" height="10" fill="#433a36" />
        <rect x="150" y="200" width="10" height="10" fill="#84757c" />
        <rect x="150" y="210" width="10" height="10" fill="#84757c" />
        <rect x="160" y="210" width="10" height="10" fill="#84757c" />
        <rect x="160" y="200" width="10" height="10" fill="#84757c" />
        <rect x="170" y="200" width="10" height="10" fill="#84757c" />
        <rect x="170" y="210" width="10" height="10" fill="#84757c" />
        <rect x="130" y="240" width="10" height="10" fill="#84757c" />
        <rect x="140" y="240" width="10" height="10" fill="#84757c" />
        <rect x="150" y="240" width="10" height="10" fill="#84757c" />
        <rect x="140" y="230" width="10" height="10" fill="#4f4141" />
        <rect x="150" y="230" width="10" height="10" fill="#4f4141" />
        <rect x="150" y="220" width="10" height="10" fill="#4f4141" />
        <rect x="160" y="220" width="10" height="10" fill="#4f4141" />
        <rect x="160" y="230" width="10" height="10" fill="#847578" />
        <rect x="320" y="290" width="10" height="10" fill="#665776" />
        <rect x="310" y="290" width="10" height="10" fill="#665776" />
        <rect x="300" y="290" width="10" height="10" fill="#665776" />
        <rect x="300" y="280" width="10" height="10" fill="#665776" />
        <rect x="310" y="280" width="10" height="10" fill="#665776" />
        <rect x="320" y="280" width="10" height="10" fill="#665776" />
        <rect x="270" y="210" width="10" height="10" fill="#514245" />
        <rect x="280" y="210" width="10" height="10" fill="#514245" />
        <rect x="290" y="210" width="10" height="10" fill="#514245" />
        <rect x="290" y="200" width="10" height="10" fill="#514245" />
        <rect x="280" y="200" width="10" height="10" fill="#514245" />
        <rect x="290" y="220" width="10" height="10" fill="#514245" />
        <rect x="300" y="220" width="10" height="10" fill="#514245" />
        <rect x="290" y="240" width="10" height="10" fill="#533734" />
        <rect x="290" y="250" width="10" height="10" fill="#533734" />
        <rect x="290" y="260" width="10" height="10" fill="#533734" />
        <rect x="300" y="260" width="10" height="10" fill="#533734" />
        <rect x="300" y="250" width="10" height="10" fill="#533734" />
        <rect x="300" y="270" width="10" height="10" fill="#533734" />
        <rect x="310" y="270" width="10" height="10" fill="#533734" />
        <rect x="270" y="230" width="10" height="10" fill="#524c4d" />
        <rect x="260" y="230" width="10" height="10" fill="#524c4d" />
        <rect x="260" y="240" width="10" height="10" fill="#524c4d" />
        <rect x="270" y="240" width="10" height="10" fill="#524c4d" />
        <rect x="240" y="240" width="10" height="10" fill="#9e9dc5" />
        <rect x="230" y="240" width="10" height="10" fill="#9e9dc5" />
        <rect x="230" y="230" width="10" height="10" fill="#9e9dc5" />
        <rect x="240" y="230" width="10" height="10" fill="#9e9dc5" />
        <rect x="250" y="230" width="10" height="10" fill="#9e9dc5" />
        <rect x="250" y="240" width="10" height="10" fill="#9e9dc5" />
        <rect x="250" y="200" width="10" height="10" fill="#968f97" />
        <rect x="260" y="200" width="10" height="10" fill="#968f97" />
        <rect x="210" y="200" width="10" height="10" fill="#968f97" />
        <rect x="200" y="200" width="10" height="10" fill="#968f97" />
        <rect x="180" y="200" width="10" height="10" fill="#552e18" />
        <rect x="190" y="200" width="10" height="10" fill="#552e18" />
        <rect x="210" y="190" width="10" height="10" fill="#4a1a1c" />
        <rect x="220" y="190" width="10" height="10" fill="#4a1a1c" />
        <rect x="230" y="190" width="10" height="10" fill="#4a1a1c" />
        <rect x="240" y="190" width="10" height="10" fill="#4a1a1c" />
        <rect x="230" y="200" width="10" height="10" fill="#f6f0f5" />
        <rect x="240" y="200" width="10" height="10" fill="#f6f0f5" />
        <rect x="220" y="200" width="10" height="10" fill="#f6f0f5" />
        <rect x="260" y="210" width="10" height="10" fill="#988485" />
        <rect x="250" y="210" width="10" height="10" fill="#988485" />
        <rect x="240" y="210" width="10" height="10" fill="#988485" />
        <rect x="230" y="210" width="10" height="10" fill="#988485" />
        <rect x="220" y="210" width="10" height="10" fill="#988485" />
        <rect x="210" y="210" width="10" height="10" fill="#988485" />
        <rect x="200" y="210" width="10" height="10" fill="#988485" />
        <rect x="200" y="220" width="10" height="10" fill="#988485" />
        <rect x="210" y="230" width="10" height="10" fill="#988485" />
        <rect x="200" y="240" width="10" height="10" fill="#988485" />
        <rect x="210" y="240" width="10" height="10" fill="#988485" />
        <rect x="200" y="250" width="10" height="10" fill="#988485" />
        <rect x="210" y="250" width="10" height="10" fill="#988485" />
        <rect x="220" y="240" width="10" height="10" fill="#9e9cc4" />
        <rect x="220" y="230" width="10" height="10" fill="#9e9cc4" />
        <rect x="220" y="250" width="10" height="10" fill="#594547" />
        <rect x="230" y="250" width="10" height="10" fill="#594547" />
        <rect x="240" y="250" width="10" height="10" fill="#594547" />
        <rect x="240" y="260" width="10" height="10" fill="#594547" />
        <rect x="230" y="260" width="10" height="10" fill="#594547" />
        <rect x="220" y="260" width="10" height="10" fill="#594547" />
        <rect x="220" y="270" width="10" height="10" fill="#594547" />
        <rect x="230" y="270" width="10" height="10" fill="#594547" />
        <rect x="200" y="290" width="10" height="10" fill="#594547" />
        <rect x="210" y="290" width="10" height="10" fill="#594547" />
        <rect x="190" y="280" width="10" height="10" fill="#594547" />
        <rect x="200" y="280" width="10" height="10" fill="#594547" />
        <rect x="210" y="280" width="10" height="10" fill="#594547" />
        <rect x="210" y="270" width="10" height="10" fill="#594547" />
        <rect x="200" y="270" width="10" height="10" fill="#594547" />
        <rect x="190" y="270" width="10" height="10" fill="#594547" />
        <rect x="190" y="260" width="10" height="10" fill="#594547" />
        <rect x="200" y="260" width="10" height="10" fill="#594547" />
        <rect x="210" y="260" width="10" height="10" fill="#594547" />
        <rect x="180" y="250" width="10" height="10" fill="#594547" />
        <rect x="190" y="250" width="10" height="10" fill="#594547" />
        <rect x="190" y="220" width="10" height="10" fill="#594547" />
        <rect x="190" y="230" width="10" height="10" fill="#594547" />
        <rect x="190" y="240" width="10" height="10" fill="#594547" />
        <rect x="200" y="230" width="10" height="10" fill="#594547" />
        <rect x="190" y="210" width="10" height="10" fill="#d5974b" />
        <rect x="180" y="210" width="10" height="10" fill="#d5974b" />
        <rect x="180" y="220" width="10" height="10" fill="#d5974b" />
        <rect x="180" y="230" width="10" height="10" fill="#d5974b" />
        <rect x="180" y="240" width="10" height="10" fill="#8b5a49" />
        <rect x="330" y="290" width="10" height="10" fill="#685876" />
        <rect x="330" y="280" width="10" height="10" fill="#685876" />
        <rect x="330" y="300" width="10" height="10" fill="#4f2614" />
        <rect x="340" y="310" width="10" height="10" fill="#4f2614" />
        <rect x="340" y="320" width="10" height="10" fill="#4f2614" />
        <rect x="330" y="330" width="10" height="10" fill="#4f2614" />
        <rect x="320" y="330" width="10" height="10" fill="#4f2614" />
        <rect x="310" y="320" width="10" height="10" fill="#4f2614" />
        <rect x="310" y="310" width="10" height="10" fill="#4f2614" />
        <rect x="300" y="310" width="10" height="10" fill="#4f2614" />
        <rect x="300" y="300" width="10" height="10" fill="#4f2614" />
        <rect x="310" y="300" width="10" height="10" fill="#d1867a" />
        <rect x="320" y="300" width="10" height="10" fill="#d1867a" />
        <rect x="320" y="310" width="10" height="10" fill="#d1867a" />
        <rect x="320" y="320" width="10" height="10" fill="#d1867a" />
        <rect x="330" y="320" width="10" height="10" fill="#d1867a" />
        <rect x="330" y="310" width="10" height="10" fill="#d1867a" />
        <rect x="160" y="250" width="10" height="10" fill="#59332a" />
        <rect x="160" y="260" width="10" height="10" fill="#59332a" />
        <rect x="150" y="260" width="10" height="10" fill="#59332a" />
        <rect x="140" y="260" width="10" height="10" fill="#59332a" />
        <rect x="140" y="270" width="10" height="10" fill="#59332a" />
        <rect x="150" y="270" width="10" height="10" fill="#59332a" />
        <rect x="150" y="280" width="10" height="10" fill="#d3d5e0" />
        <rect x="140" y="280" width="10" height="10" fill="#d3d5e0" />
        <rect x="130" y="280" width="10" height="10" fill="#d3d5e0" />
        <rect x="120" y="280" width="10" height="10" fill="#d3d5e0" />
        <rect x="120" y="290" width="10" height="10" fill="#f5f3e8" />
        <rect x="130" y="290" width="10" height="10" fill="#f5f3e8" />
        <rect x="140" y="290" width="10" height="10" fill="#f5f3e8" />
        <rect x="150" y="290" width="10" height="10" fill="#f5f3e8" />
        <rect x="160" y="290" width="10" height="10" fill="#705268" />
        <rect x="160" y="300" width="10" height="10" fill="#705268" />
        <rect x="150" y="300" width="10" height="10" fill="#4e2528" />
        <rect x="160" y="310" width="10" height="10" fill="#4e2528" />
        <rect x="160" y="320" width="10" height="10" fill="#4e2528" />
        <rect x="160" y="330" width="10" height="10" fill="#4e2528" />
        <rect x="160" y="340" width="10" height="10" fill="#4e2528" />
        <rect x="150" y="330" width="10" height="10" fill="#4e2528" />
        <rect x="140" y="320" width="10" height="10" fill="#4e2528" />
        <rect x="130" y="330" width="10" height="10" fill="#4e2528" />
        <rect x="120" y="340" width="10" height="10" fill="#4e2528" />
        <rect x="110" y="330" width="10" height="10" fill="#c2997d" />
        <rect x="110" y="320" width="10" height="10" fill="#c2997d" />
        <rect x="110" y="310" width="10" height="10" fill="#c2997d" />
        <rect x="120" y="300" width="10" height="10" fill="#c2997d" />
        <rect x="120" y="310" width="10" height="10" fill="#edbaa1" />
        <rect x="120" y="320" width="10" height="10" fill="#edbaa1" />
        <rect x="120" y="330" width="10" height="10" fill="#edbaa1" />
        <rect x="130" y="320" width="10" height="10" fill="#edbaa1" />
        <rect x="130" y="310" width="10" height="10" fill="#edbaa1" />
        <rect x="130" y="300" width="10" height="10" fill="#edbaa1" />
        <rect x="140" y="300" width="10" height="10" fill="#edbaa1" />
        <rect x="140" y="310" width="10" height="10" fill="#edbaa1" />
        <rect x="150" y="310" width="10" height="10" fill="#edbaa1" />
        <rect x="150" y="320" width="10" height="10" fill="#edbaa1" />
        <rect x="170" y="370" width="10" height="10" fill="#1a0903" />
        <rect x="170" y="360" width="10" height="10" fill="#1a0903" />
        <rect x="170" y="350" width="10" height="10" fill="#1a0903" />
        <rect x="230" y="360" width="10" height="10" fill="#1a0903" />
        <rect x="250" y="360" width="10" height="10" fill="#1a0903" />
        <rect x="250" y="370" width="10" height="10" fill="#1a0903" />
        <rect x="310" y="330" width="10" height="10" fill="#1a0903" />
        <rect x="310" y="340" width="10" height="10" fill="#1a0903" />
        <rect x="310" y="350" width="10" height="10" fill="#1a0903" />
        <rect x="300" y="360" width="10" height="10" fill="#1a0903" />
        <rect x="300" y="370" width="10" height="10" fill="#1a0903" />
        <rect x="290" y="300" width="10" height="10" fill="#1a0903" />
        <rect x="280" y="310" width="10" height="10" fill="#1a0903" />
        <rect x="290" y="310" width="10" height="10" fill="#1a0903" />
        <rect x="300" y="320" width="10" height="10" fill="#1a0903" />
        <rect x="170" y="270" width="10" height="10" fill="#cac3be" />
        <rect x="170" y="280" width="10" height="10" fill="#cac3be" />
        <rect x="260" y="330" width="10" height="10" fill="#623f24" />
        <rect x="230" y="330" width="10" height="10" fill="#623f24" />
        <rect x="220" y="320" width="10" height="10" fill="#623f24" />
        <rect x="270" y="320" width="10" height="10" fill="#623f24" />
        <rect x="280" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="270" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="280" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="300" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="300" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="280" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="270" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="260" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="250" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="270" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="280" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="300" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="260" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="260" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="270" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="270" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="280" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="290" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="280" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="220" y="370" width="10" height="10" fill="#8e693b" />
        <rect x="220" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="360" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="220" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="230" y="350" width="10" height="10" fill="#8e693b" />
        <rect x="230" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="220" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="220" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="170" y="330" width="10" height="10" fill="#8e693b" />
        <rect x="170" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="340" width="10" height="10" fill="#8e693b" />
        <rect x="170" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="310" width="10" height="10" fill="#8e693b" />
        <rect x="180" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="190" y="310" width="10" height="10" fill="#8e693b" />
        <rect x="200" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="210" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="230" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="240" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="250" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="260" y="320" width="10" height="10" fill="#8e693b" />
        <rect x="170" y="300" width="10" height="10" fill="#542d16" />
        <rect x="170" y="290" width="10" height="10" fill="#542d16" />
        <rect x="170" y="310" width="10" height="10" fill="#8d6c3f" />
        <rect x="200" y="300" width="10" height="10" fill="#938a84" />
        <rect x="210" y="300" width="10" height="10" fill="#938a84" />
        <rect x="190" y="290" width="10" height="10" fill="#938a84" />
        <rect x="220" y="300" width="10" height="10" fill="#938a84" />
        <rect x="230" y="300" width="10" height="10" fill="#938a84" />
        <rect x="240" y="300" width="10" height="10" fill="#938a84" />
        <rect x="240" y="270" width="10" height="10" fill="#574545" />
        <rect x="250" y="300" width="10" height="10" fill="#453138" />
        <rect x="260" y="300" width="10" height="10" fill="#453138" />
        <rect x="270" y="300" width="10" height="10" fill="#453138" />
        <rect x="280" y="290" width="10" height="10" fill="#453138" />
        <rect x="260" y="350" width="10" height="10" fill="#643a25" />
        <rect x="290" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="280" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="270" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="260" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="260" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="270" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="280" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="180" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="180" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="190" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="190" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="200" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="210" y="380" width="10" height="10" fill="#3e0c0a" />
        <rect x="210" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="200" y="390" width="10" height="10" fill="#3e0c0a" />
        <rect x="280" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="270" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="260" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="380" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="390" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="410" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="260" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="270" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="280" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="290" y="430" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="430" width="10" height="10" fill="#3c0604" />
        <rect x="250" y="440" width="10" height="10" fill="#3c0604" />
        <rect x="300" y="440" width="10" height="10" fill="#3c0604" />
        <rect x="180" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="190" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="200" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="210" y="400" width="10" height="10" fill="#3c0604" />
        <rect x="170" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="180" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="190" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="200" y="420" width="10" height="10" fill="#3c0604" />
        <rect x="210" y="410" width="10" height="10" fill="#3c0604" />
        <rect x="200" y="430" width="10" height="10" fill="#3c0604" />
        <rect x="200" y="440" width="10" height="10" fill="#3c0604" />
        <rect x="160" y="430" width="10" height="10" fill="#3c0604" />
        <rect x="160" y="440" width="10" height="10" fill="#3c0604" />
        <rect x="170" y="430" width="10" height="10" fill="#3c0604" />
        <rect x="170" y="440" width="10" height="10" fill="#a45a2a" />
        <rect x="180" y="440" width="10" height="10" fill="#a45a2a" />
        <rect x="190" y="440" width="10" height="10" fill="#a45a2a" />
        <rect x="190" y="430" width="10" height="10" fill="#a45a2a" />
        <rect x="180" y="430" width="10" height="10" fill="#a45a2a" />
        <rect x="170" y="410" width="10" height="10" fill="#a45a2a" />
        <rect x="180" y="410" width="10" height="10" fill="#a45a2a" />
        <rect x="190" y="410" width="10" height="10" fill="#a45a2a" />
        <rect x="200" y="410" width="10" height="10" fill="#a45a2a" />
        <rect x="260" y="430" width="10" height="10" fill="#63291e" />
        <rect x="270" y="430" width="10" height="10" fill="#63291e" />
        <rect x="280" y="430" width="10" height="10" fill="#63291e" />
        <rect x="270" y="440" width="10" height="10" fill="#63291e" />
        <rect x="280" y="440" width="10" height="10" fill="#63291e" />
        <rect x="290" y="440" width="10" height="10" fill="#63291e" />
        <rect x="260" y="440" width="10" height="10" fill="#63291e" />
        <rect x="260" y="410" width="10" height="10" fill="#63291e" />
        <rect x="270" y="410" width="10" height="10" fill="#63291e" />
        <rect x="280" y="410" width="10" height="10" fill="#63291e" />
      </svg>
    </div>
  );
};

export default PixelCharacter;
