import { useContext } from "react";

import { Arc, Group, Line } from "react-konva";

import Point from "./Point";
import getSegmentParams from "./geometry/getSegmentParams";
import { MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";
import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Segment({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { getMathCoords, getCanvasCoords } = useContext(CoordFuncContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);

  const { originCoords } = canvasInfo;
  const { pointRadius } = toolbar;
  const { styles, anchors } = props;
  const { color, strokeWidth } = styles;
  const [mainAnchor, regAnchor] = anchors;

  const { isACircle, center, radius, arcAngle, rotationAngle, midpoint } = getSegmentParams(mainAnchor, regAnchor, getMathCoords, getCanvasCoords, originCoords.y)

  const mainAnchorProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [mainAnchor]
  };
  const regAnchorProps = {
    ...props,
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [regAnchor]
  };
  const transformAnchorProps = {
    ...props,
    styles: { ...styles, color: "green" },
    anchors: [midpoint]
  }

  return (
    <Group id={id}>
      { isACircle ?
        <Arc
          x={center.canvasX}
          y={originCoords.y}
          innerRadius={radius}
          outerRadius={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={false}
          angle={360 - arcAngle}
          rotation={-rotationAngle}
          clockwise
        /> :
        <Line
          points={[mainAnchor.canvasX, mainAnchor.canvasY, regAnchor.canvasX, regAnchor.canvasY]}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={false}
        />
      }
      <Point { ...transformAnchorProps }/>
      <Point handleParentDrag={handleMainDrag} { ...mainAnchorProps }/>
      <Point handleParentDrag={handleRegDrag} { ...regAnchorProps }/>
    </Group>
  );

  function handleMainDrag(konvaEvent) {
    const konvaMainAnchor = konvaEvent.target;
    const coords = getMathCoords(konvaMainAnchor.x(), konvaMainAnchor.y());
    const dispVector = {
      x: regAnchor.canvasX - mainAnchor.canvasX,
      y: regAnchor.canvasY - mainAnchor.canvasY
    };
    
    const awayFromBoundary = coords.canvasY + dispVector.y < originCoords.y - pointRadius;
    const draggedAnchors = [
      coords, 
      awayFromBoundary ? getMathCoords(coords.canvasX + dispVector.x, coords.canvasY + dispVector.y) : regAnchor
    ];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleRegDrag(konvaEvent) {
    const konvaRegAnchor = konvaEvent.target;
    
    const coords = getMathCoords(konvaRegAnchor.x(), konvaRegAnchor.y());
    const draggedAnchors = [mainAnchor, coords];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }
}