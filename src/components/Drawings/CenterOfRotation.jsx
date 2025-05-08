import { useContext, useRef } from "react";

import { Circle, Group } from "react-konva";

import Point from "./Point";
import useAnimationShape from "../../hooks/useAnimationShape";
import getHypCircleParams from "./geometry/getHypCircleParams";
import { ANIMATION_SHAPE_COLOR, DASH_LENGTH, DASH_SEPARATION } from "./util/drawingsConstants";
import { AnimationDataContext, CoordFuncContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import getAnimationFunction from "./util/getAnimationFunction";

export default function CenterOfRotation({ id, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext)
  const { getCanvasCoords, getMathCoords } = useContext(CoordFuncContext);
  const { animationShapeRef, animationFuncRef } = useContext(AnimationDataContext);

  const bdryCircleRef = useRef(null);
  useAnimationShape(bdryCircleRef, (currRotation, degrees) => currRotation - degrees);

  const { styles, anchors } = props;
  const center = anchors[0];
  const anchorCanvasY = Math.floor(center.canvasY - window.innerHeight * 0.1);
  const anchorCoords = getMathCoords(center.canvasX, anchorCanvasY);

  const { eucCenter, radius } = getHypCircleParams(center, anchorCoords, getCanvasCoords);

  const centerProps = {
    ...props,
    styles: { ...styles, color: ANIMATION_SHAPE_COLOR },
    anchors: [{ ...center }]
  };

  return (
    <Group id={id}>
      <Circle
        ref={bdryCircleRef}
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={ANIMATION_SHAPE_COLOR}
        dash={[DASH_LENGTH, DASH_SEPARATION]}
        listening={false}
      />
      <Point handleParentDrag={handleCenterDrag} { ...centerProps} />
    </Group>
  );

  function handleCenterDrag(konvaEvent) {
    const konvaCenter = konvaEvent.target;

    const coords = getMathCoords(konvaCenter.x(), konvaCenter.y());
    const draggedAnchors = [coords];

    const draggedDrawing = { id, ...props, anchors: draggedAnchors };
    animationFuncRef.current = getAnimationFunction(draggedDrawing, getCanvasCoords);
    animationShapeRef.current = draggedDrawing;

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }
}