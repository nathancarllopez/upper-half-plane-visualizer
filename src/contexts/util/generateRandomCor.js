export default function generateRandomCor() {
  const randomCenter = {
    mathX: (Math.random() * window.innerWidth - window.innerWidth / 2) / 3,
    mathY: (Math.random() * 0.9 * window.innerHeight) / 3
  };

  return {
    name: 'rotation',
    id: "random-starter-cor",
    isActive: false,
    isAnimationShape: true,
    isSelected: false,
    styles: { pointRadius: 8 },
    anchors: [{
      ...randomCenter,
      canvasX: Math.floor(window.innerWidth / 2 + randomCenter.mathX),
      canvasY: Math.floor(0.9 * window.innerHeight - randomCenter.mathY)
    }]
  };
}