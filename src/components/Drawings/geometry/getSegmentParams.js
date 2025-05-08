import getGeodesicParams from "./getGeodesicParams";

export default function getSegmentParams(anchor1, anchor2, getMathCoords, getCanvasCoords, originY) {
  const { isACircle, center, radius } = getGeodesicParams(anchor1, anchor2, getMathCoords, originY);

  const [rightAnchor, leftAnchor] = anchor2.canvasX > anchor1.canvasX ?
    [anchor2, anchor1] : [anchor1, anchor2];
  const rotationAngle = computeAngle(rightAnchor, center);
  const arcAngle = computeAngle(leftAnchor, center) - rotationAngle;

  const mathRadius = Math.hypot(anchor1.mathX - anchor2.mathX, anchor1.mathY - anchor2.mathY);
  const midpoint = computeMidpoint(center, rotationAngle, arcAngle, mathRadius, getCanvasCoords);

  return { isACircle, center, radius, rotationAngle, arcAngle, anchor1, anchor2, midpoint };
}

function computeAngle(anchor, center, inDegrees = true) {
  const radians = Math.atan2(anchor.mathY - center.mathY, anchor.mathX - center.mathX);

  if (!inDegrees) return radians;
  return radians * (180 / Math.PI);
}

function computeMidpoint(center, rotationAngle, arcAngle, mathRadius, getCanvasCoords) {
  const targetAngle = rotationAngle + arcAngle / 2;
  const midpoint = {
    mathX: center.mathX + mathRadius * Math.cos(targetAngle),
    mathY: center.mathY + mathRadius * Math.sin(targetAngle)
  };

  const midpointCoords = getCanvasCoords(midpoint.mathX, midpoint.mathY);

  return midpointCoords;
}