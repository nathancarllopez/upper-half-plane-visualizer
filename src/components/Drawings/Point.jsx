import { useContext, useState } from "react";

import { Circle, Group, Rect } from "react-konva";

import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Point({ id = "", handleParentDrag = null, ...props }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);
  const { getMathCoords } = useContext(CoordFuncContext);
  const [isFocused, setIsFocused] = useState(false);
  
  const { originCoords, shapeIsDragging } = canvasInfo;
  const { name, isActive, isSelected, styles, anchors } = props;
  const { color, pointRadius } = styles;
  const { canvasX, canvasY } = anchors[0];

  if (isActive) {
    return (
      <Circle
        id={id}
        name={name}
        x={canvasX}
        y={canvasY}
        radius={pointRadius}
        stroke={ACTIVE_POINT_COLOR}
        fill={ACTIVE_POINT_COLOR}
        listening={false}
      />
    );
  }

  const Dot = () => (
    <Circle
      id={id ? id : undefined}
      name={name}
      x={canvasX}
      y={canvasY}
      radius={pointRadius}
      stroke={color}
      fill={color}
      onMouseEnter={() => { if (!isFocused) setIsFocused(true) }}
      onMouseLeave={() => setIsFocused(false)}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={() => universalDispatch({ type: 'shapeDragEnd' })}
      dragBoundFunc={handleOutOfBounds}
    />
  );

  return (
    <>
      { (isSelected || isFocused) && !shapeIsDragging && 
        <FocusFrame canvasX={canvasX} canvasY={canvasY} pointRadius={pointRadius} />
      }
      {/* 
        The ternary operator below is used so that every drawing can access its
        id by calling "shape.getParent().id()" without checking if the point in
        question is its own drawing or an anchor of a larger drawing.
      */}
      { id === "" ? Dot() : <Group id={id}>{ Dot() }</Group> }
    </>
  );

  function handleDragStart() {
    universalDispatch({ type: 'shapeDragStart' });
    universalDispatch({ type: 'copyDrawings' });
  }

  function handleDragMove(konvaEvent) {
    if (id === "") {
      if (handleParentDrag === null) {
        throw new Error(`No drag handler passed for: ${konvaEvent}`);
      }

      handleParentDrag(konvaEvent);
      return;
    }

    const konvaPoint = konvaEvent.target;
    const coords = getMathCoords(konvaPoint.x(), konvaPoint.y());
    const draggedAnchors = [coords];

    universalDispatch({ type: 'shapeDragMove', id, draggedAnchors });
    universalDispatch({ type: 'setCursorCoords', coords });
  }

  function handleOutOfBounds({ x, y }) {
    if (y > originCoords.y - pointRadius) {
      return { x, y: originCoords.y - pointRadius }
    }
    if (y < pointRadius) {
      return { x, y: pointRadius }
    }
    if (x > window.innerWidth - pointRadius) {
      return { x: window.innerWidth - pointRadius, y }
    }
    if (x < pointRadius) {
      return { x: pointRadius, y }
    }
    return { x, y }
  }
}

function FocusFrame({ canvasX, canvasY, pointRadius }) {
  return (
    <Rect
      x={canvasX - pointRadius - 2}
      y={canvasY - pointRadius - 2}
      width={2 * (pointRadius + 2)}
      height={2 * (pointRadius + 2)}
      stroke={FOCUS_FRAME_COLOR}
      listening={false}
      strokeWidth={1}
    />
  );
}

const ACTIVE_POINT_COLOR = "yellow";
const FOCUS_FRAME_COLOR = 'white';