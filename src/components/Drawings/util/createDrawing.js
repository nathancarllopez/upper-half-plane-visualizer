export default function createDrawing(
  currentDrawings,
  toolbar,
  lastClickedCoords,
  longPress
) {
  const { clickTool, drawingColor, strokeWidth, pointRadius } = toolbar;
  const activePoints = currentDrawings.filter(drawing => drawing.isActive);
  
  const template = {
    name: 'point',
    id: generateId(),
    isActive: false,
    isAnimationShape: false,
    isSelected: false,
    styles: { color: drawingColor, strokeWidth, pointRadius },
    anchors: [{ ...lastClickedCoords }]
  };

  switch(clickTool) {
    case 'rotation':
    case 'horocycle':
    case 'point': {
      return {
        ...template,
        name: clickTool,
        isAnimationShape: clickTool === 'rotation',
      };
    };

    case 'translation':
    case 'segment':
    case 'circle':
    case 'geodesic': {
      if (activePoints.length === 0) {
        return {
          ...template,
          isActive: true,
        };
      }

      const anchor1 = activePoints[0].anchors[0];
      const anchor2 = { ...lastClickedCoords };

      return {
        ...template,
        name: clickTool,
        isAnimationShape: clickTool === 'translation',
        id: generateId(),
        anchors: [anchor1, anchor2]
      };
    };

    case 'polygon': {
      if (!longPress) {
        return {
          ...template,
          isActive: true
        };
      }

      const firstAnchors = activePoints.map(drawing => drawing.anchors[0])
      const lastAnchor = { ...lastClickedCoords };

      return {
        ...template,
        name: clickTool,
        id: generateId(),
        anchors: [ ...firstAnchors, lastAnchor ]
      }
    };

    default: {
      throw new Error(`Unexpected click tool: ${clickTool}`);
    }
  }
}

function generateId() {
  return `${Date.now()}-*-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`
}