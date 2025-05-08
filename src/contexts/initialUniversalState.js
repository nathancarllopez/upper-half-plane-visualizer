import generateRandomCor from "./util/generateRandomCor";
import generateRandomPolygon from "./util/generateRandomPolygon";

export const initialUniversalState = {
  canvasInfo: {
    snapshots: [[], [generateRandomPolygon(), generateRandomCor()]],
    currIdx: 1,
    // snapshots: [[]],
    // currIdx: 0,
    unitsPerPixel: 1,
    originCoords: { x: window.innerWidth / 2, y: window.innerHeight * 0.9 },
    cursorCoords: null,
    shapeIsDragging: false,
    canvasIsDragging: false,
    isAnimating: true,
    animationSpeed: 60,
  },
  toolbar: {
    clickTool: "rotation",
    drawingColor: "#FFFFFF",  // To do: Figure out theming and make this color switch from light to dark mode
    strokeWidth: 2,
    pointRadius: 8,
    openDropdown: null,

    isVertical: false,
    showCursorCoords: true,
    showAxisTicks: true,
    showAxisTickLabels: true,
    showToolbarInstructions: true,
    darkMode: true,

    decimalPlaceCount: 2,
    zoomSensitivity: 1000,  // A dampener for zooming in and out
    // unitsPerPixel ~ 2 ^ (cummulativePixelsScrolled / zoomSensitivity)

    // ms
    holdDuration: 500,
    toastDuration: 5000,

    // pixels
    zoomMinThreshold: 2,
    axisTickSeparation: 50,
    canvasDragMinThreshold: 3,
  },
  activeToasts: [],
  // controlPanels: [] // { title, placement, wasDragged }
  controlPanels: [
    { title: "Animations", placement: { left: 0, bottom: 0 }, wasDragged: false, key: performance.now() }
  ]
};