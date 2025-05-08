import { EQUAL_THRESHOLD } from "../util/drawingsConstants";

export default function getHypCircleParams(center, radiusAdjuster, getCanvasCoords) {
  const deltaX = radiusAdjuster.mathX - center.mathX;
  if (Math.abs(deltaX) < EQUAL_THRESHOLD) {
    const mathY = (radiusAdjuster.mathY ** 2 + center.mathY ** 2) / (2 * radiusAdjuster.mathY);
    const eucCenter = getCanvasCoords(center.mathX, mathY);
    const radius = computeRadius(radiusAdjuster, eucCenter);

    return { eucCenter, radius };
  }

  const deltaY = radiusAdjuster.mathY - center.mathY;
  const midpointX = (radiusAdjuster.mathX + center.mathX) / 2;
  const midpointY = (radiusAdjuster.mathY + center.mathY) / 2;
  const slope = deltaY / deltaX;
  const centerOfGeod = midpointX + midpointY * slope;

  const mathY = radiusAdjuster.mathY + (centerOfGeod - radiusAdjuster.mathX) * (center.mathX - radiusAdjuster.mathX) / radiusAdjuster.mathY;
  const eucCenter = getCanvasCoords(center.mathX, mathY);
  const radius = computeRadius(radiusAdjuster, eucCenter);
  
  return { eucCenter, radius };
}

function computeRadius(radiusAdjuster, eucCenter) {
  return Math.hypot(eucCenter.canvasX - radiusAdjuster.canvasX, eucCenter.canvasY - radiusAdjuster.canvasY);
}