import getSegmentParams from "./getSegmentParams";

export default function getPolygonParams(anchors, getMathCoords, getCanvasCoords, originY) {
  return anchors.map((anchor, idx) => {
    const nextAnchor = anchors[(idx + 1) % anchors.length];
    return getSegmentParams(anchor, nextAnchor, getMathCoords, getCanvasCoords, originY);
  });
}