import { EQUAL_THRESHOLD } from "../util/drawingsConstants";

export default function getGeodesicParams(anchor1, anchor2, getMathCoords, originY) {
  const deltaX = anchor2.canvasX - anchor1.canvasX;
  const isACircle = Math.abs(deltaX) > EQUAL_THRESHOLD;
  
  if (!isACircle) {
    return { isACircle, center: { canvasX: Infinity }, radius: Infinity };
  }

  const center = (() => {
    const deltaY = anchor2.canvasY - anchor1.canvasY;
    const midpointX = (anchor2.canvasX + anchor1.canvasX) / 2;
  
    if (Math.abs(deltaY) < EQUAL_THRESHOLD) {
      return getMathCoords(midpointX);
    }
  
    const midpointY = (anchor2.canvasY + anchor1.canvasY) / 2;
    const slope = deltaY / deltaX;
    const centerCanvasX = midpointX - slope * (originY - midpointY);

    return getMathCoords(centerCanvasX);
  })();

  const radius = Math.hypot(anchor1.canvasX - center.canvasX, anchor1.canvasY - center.canvasY);

  return { isACircle, center, radius };
}