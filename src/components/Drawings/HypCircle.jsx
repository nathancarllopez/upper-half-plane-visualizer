import { useContext } from "react";

import { Circle, Group } from "react-konva";

import Point from "./Point";
import getHypCircleParams from "./geometry/getHypCircleParams";
import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import { MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";

export default function HypCircle({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { getCanvasCoords, getMathCoords } = useContext(CoordFuncContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);

  const { originCoords } = canvasInfo;
  const { pointRadius } = toolbar;
  const { styles, anchors } = props;
  const { color, strokeWidth } = styles;
  const [center, radiusAdjuster] = anchors;
  
  const { eucCenter, radius } = getHypCircleParams(center, radiusAdjuster, getCanvasCoords);

  const centerProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [{ ...center }]
  }
  const radiusAdjusterProps = {
    ...props,
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [{ ...radiusAdjuster }]
  }

  return (
    <Group id={id}>
      <Circle
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        listening={false}
      />
      <Point handleParentDrag={handleCenterDrag} { ...centerProps }/>
      <Point handleParentDrag={handleRadiusAdjusterDrag} { ...radiusAdjusterProps }/>
    </Group>
  );

  function handleCenterDrag(konvaEvent) {
    const konvaCenter = konvaEvent.target;
    const coords = getMathCoords(konvaCenter.x(), konvaCenter.y());
    const dispVector = {
      x: radiusAdjuster.canvasX - center.canvasX,
      y: radiusAdjuster.canvasY - center.canvasY
    };

    const awayFromBoundary = coords.canvasY + dispVector.y < originCoords.y - pointRadius;
    const draggedAnchors = [
      coords, 
      awayFromBoundary ? getMathCoords(coords.canvasX + dispVector.x, coords.canvasY + dispVector.y) : radiusAdjuster
    ];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleRadiusAdjusterDrag(konvaEvent) {
    const konvaRadiusAdjuster = konvaEvent.target;

    const coords = getMathCoords(konvaRadiusAdjuster.x(), konvaRadiusAdjuster.y());
    const draggedAnchors = [center, coords];
    
    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }
}