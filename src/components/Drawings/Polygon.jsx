import { useContext } from "react";

import { Arc, Group, Line } from "react-konva";

import Point from "./Point";
import getPolygonParams from "./geometry/getPolygonParams";
import { MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";
import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Polygon({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { getMathCoords, getCanvasCoords } = useContext(CoordFuncContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);

  const { originCoords } = canvasInfo;
  const { pointRadius } = toolbar;
  const { styles, anchors } = props;
  const { color, strokeWidth } = styles;
  const [mainAnchor, ...regAnchors] = anchors;

  const sides = getPolygonParams(anchors, getMathCoords, getCanvasCoords, originCoords.y);

  const mainAnchorProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [ mainAnchor ],
  };
  const regAnchorProps = (anchor, idx) => ({
    ...props,
    name: idx.toString(),
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [ anchor ],
  });

  return (
    <Group id={id}>
      { sides.map((side, idx) => (
        side.isACircle ?
          <Arc
            key={idx}
            x={side.center.canvasX}
            y={originCoords.y}
            innerRadius={side.radius}
            outerRadius={side.radius}
            stroke={color}
            strokeWidth={strokeWidth}
            listening={false}
            angle={360 - side.arcAngle}
            rotation={-side.rotationAngle}
            clockwise
          /> :
          <Line
            key={idx}
            points={[side.anchor1.canvasX, side.anchor1.canvasY, side.anchor2.canvasX, side.anchor2.canvasY]}
            stroke={color}
            strokeWidth={strokeWidth}
            listening={false}
          />
      )) }

      <Point handleParentDrag={handleMainDrag} { ...mainAnchorProps } />
      { regAnchors.map((anchor, idx) => (
          <Point key={idx} handleParentDrag={handleRegDrag} { ...regAnchorProps(anchor, idx) }/>
        ))
      }
    </Group>
  );

  function handleMainDrag(konvaEvent) {
    const konvaMainAnchor = konvaEvent.target;
    const coords = getMathCoords(konvaMainAnchor.x(), konvaMainAnchor.y());

    const draggedRegAnchors = regAnchors.map(regAnchor => {
      const dispVector = {
        x: regAnchor.canvasX - mainAnchor.canvasX,
        y: regAnchor.canvasY - mainAnchor.canvasY
      };
      const awayFromBoundary = coords.canvasY + dispVector.y < originCoords.y - pointRadius;

      return awayFromBoundary ? getMathCoords(coords.canvasX + dispVector.x, coords.canvasY + dispVector.y) : regAnchor;
    });
    const draggedAnchors = [coords, ...draggedRegAnchors];
    
    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleRegDrag(konvaEvent) {
    const konvaRegAnchor = konvaEvent.target;
    const draggedId = parseInt(konvaRegAnchor.name())
    const coords = getMathCoords(konvaRegAnchor.x(), konvaRegAnchor.y());

    const draggedRegAnchors = regAnchors.map((regAnchor, idx) => {
      if (idx !== draggedId) return regAnchor;
      return coords;
    });
    const draggedAnchors = [mainAnchor, ...draggedRegAnchors];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  } 
}