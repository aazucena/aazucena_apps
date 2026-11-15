/**
 * A placeholder image as an inline SVG data URI, so stories don't depend on an
 * image host being up (via.placeholder.com went away and left nine stories blank).
 */
export function placeholder(
  width: number,
  height: number,
  label = `${width}×${height}`,
  background = '#D7E6EC',
  foreground = '#0E1A20',
): string {
  const fontSize = Math.max(10, Math.min(width / (label.length * 0.62), height / 3));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${background}"/>` +
    `<text x="50%" y="50%" fill="${foreground}" font-family="monospace" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
