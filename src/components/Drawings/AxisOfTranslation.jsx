import { useContext, useRef } from "react";

import { Circle, Group, Line } from "react-konva";

import Point from "./Point";
import getGeodesicParams from "./geometry/getGeodesicParams";
import useAnimationShape from "../../hooks/useAnimationShape";
import { AnimationDataContext, CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import { ANIMATION_SHAPE_COLOR, DASH_LENGTH, DASH_SEPARATION, MAIN_ANCHOR_COLOR, REG_ANCHOR_COLOR } from "./util/drawingsConstants";
import getAnimationFunction from "./util/getAnimationFunction";

export default function AxisOfTranslation({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { getMathCoords, getCanvasCoords } = useContext(CoordFuncContext);
  const { animationShapeRef, animationFuncRef } = useContext(AnimationDataContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);
  const { originCoords } = canvasInfo;

  const axisRef = useRef(null);
  useAnimationShape(axisRef, (currRotation, degrees) => currRotation + degrees / 2);

  const { pointRadius } = toolbar;
  const { styles, anchors } = props;
  const [mainAnchor, regAnchor] = anchors;

  const { isACircle, center, radius } = getGeodesicParams(mainAnchor, regAnchor, getMathCoords, originCoords.y);

  const mainAnchorProps = {
    ...props,
    styles: { ...styles, color: MAIN_ANCHOR_COLOR },
    anchors: [{ ...mainAnchor }]
  }
  const regAnchorProps = {
    ...props,
    styles: { ...styles, color: REG_ANCHOR_COLOR },
    anchors: [{ ...regAnchor }]
  }

  return (
    <Group id={id}>
      { isACircle ?
        <Circle
          ref={axisRef}
          x={center.canvasX}
          y={originCoords.y}
          radius={radius}
          stroke={ANIMATION_SHAPE_COLOR}
          dash={[DASH_LENGTH, DASH_SEPARATION]}
          listening={false}
        /> :
        <Line
          ref={axisRef}
          points={[mainAnchor.canvasX, originCoords.canvasY, mainAnchor.canvasX, 0]}
          stroke={ANIMATION_SHAPE_COLOR}
          dash={[DASH_LENGTH, DASH_SEPARATION]}
          listening={false}
        />
      }
      <Point handleParentDrag={handleMainDrag} { ...mainAnchorProps } />
      <Point handleParentDrag={handleRegDrag} { ...regAnchorProps } />
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

    const draggedDrawing = { id, ...props, anchors: draggedAnchors };
    animationFuncRef.current = getAnimationFunction(draggedDrawing, getCanvasCoords);
    animationShapeRef.current = draggedDrawing;

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleRegDrag(konvaEvent) {
    const konvaRegAnchor = konvaEvent.target;
    
    const coords = getMathCoords(konvaRegAnchor.x(), konvaRegAnchor.y());
    const draggedAnchors = [mainAnchor, coords];

    const draggedDrawing = { id, ...props, anchors: draggedAnchors };
    animationFuncRef.current = getAnimationFunction(draggedDrawing, getCanvasCoords);
    animationShapeRef.current = draggedDrawing;

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }
}