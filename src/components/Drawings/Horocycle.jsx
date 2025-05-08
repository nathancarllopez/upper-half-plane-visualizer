import { useContext } from "react";

import { Circle, Group } from "react-konva";

import Point from "./Point";
import { MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";
import { CoordFuncContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Horocycle({ id, ...props }) {
  const { getCanvasCoords, getMathCoords } = useContext(CoordFuncContext);
  const universalDispatch = useContext(UniversalStateDispatchContext);
  
  const { styles, anchors } = props;
  const { color, strokeWidth } = styles;

  const center = anchors[0];
  const radiusAdjuster = getCanvasCoords(center.mathX, 2 * center.mathY);
  const radius = center.canvasY - radiusAdjuster.canvasY;

  const centerProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [{ ...center }]
  };
  const radiusAdjusterProps = {
    ...props,
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [{ ...radiusAdjuster }]
  };

  return (
    <Group id={id}>
      <Circle
        x={center.canvasX}
        y={center.canvasY}
        radius={radius}
        stroke={color}
        listening={false}
        strokeWidth={strokeWidth}
      />
      <Point handleParentDrag={handleCenterDrag} { ...centerProps } />
      <Point handleParentDrag={handleRadiusAdjusterDrag} { ...radiusAdjusterProps }/> 
    </Group>
  );

  function handleCenterDrag(konvaEvent) {
    const konvaCenter = konvaEvent.target;

    const coords = getMathCoords(konvaCenter.x(), konvaCenter.y());
    const draggedAnchors = [coords];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleRadiusAdjusterDrag(konvaEvent) {
    const konvaRadiusAdjuster = konvaEvent.target;
    if (konvaRadiusAdjuster.x() !== center.canvasX) {
      konvaRadiusAdjuster.x(center.canvasX);
    }

    const radiusAdjusterCoords = getMathCoords(konvaRadiusAdjuster.x(), konvaRadiusAdjuster.y());
    const draggedAnchors = [getCanvasCoords(radiusAdjusterCoords.mathX, Math.floor(radiusAdjusterCoords.mathY / 2))];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords: radiusAdjusterCoords });
  }
}