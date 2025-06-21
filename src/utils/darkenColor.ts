export const darkenColor = (
  hex: string,
  baseFactor: number = 0.2,
  dominantFactor: number = 0.7,
): string => {
  if (!/^#?[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/.test(hex)) {
    return '#000000';
  }

  hex = hex.replace(/^#/, '');

  const rgbHex = hex.substring(0, 6);

  const r = parseInt(rgbHex.substring(0, 2), 16);
  const g = parseInt(rgbHex.substring(2, 4), 16);
  const b = parseInt(rgbHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#000000';
  }

  const maxComponent = Math.max(r, g, b);
  const isRedDominant = maxComponent === r;
  const isGreenDominant = maxComponent === g;
  const isBlueDominant = maxComponent === b;

  const darkenedR = Math.max(
    0,
    Math.floor(r * (isRedDominant ? dominantFactor : baseFactor)),
  );
  const darkenedG = Math.max(
    0,
    Math.floor(g * (isGreenDominant ? dominantFactor : baseFactor)),
  );
  const darkenedB = Math.max(
    0,
    Math.floor(b * (isBlueDominant ? dominantFactor : baseFactor)),
  );

  const brightness = darkenedR * 0.299 + darkenedG * 0.587 + darkenedB * 0.114;
  if (brightness > 200) {
    return '#000000';
  }

  return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
};

export default darkenColor;
