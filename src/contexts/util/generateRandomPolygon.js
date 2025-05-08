export default function generateRandomPolygon() {
  const letters = '0123456789ABCDEF';
  const colorChars = ["#"];
  for (let _ = 0; _ < 6; _++) {
    colorChars.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  const color = colorChars.join("");

  const strokeWidth = Math.ceil(Math.random() * 9);
  const pointRadius = strokeWidth + Math.ceil(Math.random() * 3);
  
  const numAnchors = 2 + Math.ceil(Math.random() * 3);
  const anchors = [];
  for (let _ = 0; _ < numAnchors; _++) {
    const coords = {
      mathX: Math.random() * window.innerWidth - window.innerWidth / 2,
      mathY: Math.random() * 0.9 * window.innerHeight
    };
    anchors.push({
      ...coords,
      canvasX: Math.floor(window.innerWidth / 2 + coords.mathX),
      canvasY: Math.floor(0.9 * window.innerHeight - coords.mathY)
    });
  }

  return {
    name: 'polygon',
    id: "random-starter-polygon",
    isActive: false,
    isAnimationShape: false,
    isSelected: false,
    styles: { color, strokeWidth, pointRadius },
    anchors
  }
}