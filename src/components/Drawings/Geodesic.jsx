import { useContext } from "react";

import { Circle, Group, Line } from "react-konva";

import Point from "./Point";
import getGeodesicParams from "./geometry/getGeodesicParams";
import { MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";
import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Geodesic({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { getMathCoords } = useContext(CoordFuncContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);

  const { originCoords } = canvasInfo;
  const { pointRadius } = toolbar;
  const { styles, anchors } = props;
  const { color, strokeWidth } = styles;
  const [mainAnchor, regAnchor] = anchors;

  const { isACircle, center, radius } = getGeodesicParams(mainAnchor, regAnchor, getMathCoords, originCoords.y)

  const mainAnchorProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [{ ...mainAnchor }]
  };
  const regAnchorProps = {
    ...props,
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [{ ...regAnchor }]
  };

  return (
    <Group id={id}>
      { isACircle ? 
        <Circle
          x={center.canvasX}
          y={originCoords.y}
          radius={radius}
          listening={false}
          stroke={color}
          strokeWidth={strokeWidth}
        /> :
        <Line
          points={[mainAnchor.canvasX, originCoords.y, mainAnchor.canvasX, 0]}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={false}
        />
      }
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

