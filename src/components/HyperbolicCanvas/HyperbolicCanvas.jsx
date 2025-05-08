import { useContext, useEffect, useRef } from "react";

import { Layer, Stage } from "react-konva";

import Mask from "./Mask";
import Cursor from "./Cursor";
import Axes from "./Axes/Axes";
import AllDrawings from "../Drawings/AllDrawings";
import createDrawing from "../Drawings/util/createDrawing";
import { IS_TOUCH_DEVICE } from "../../util/constants";
import { CoordFuncContext, UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function HyperbolicCanvas() {
  /** Context */
  //#region
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);
  const { getCurrentCoords, getMathCoords } = useContext(CoordFuncContext);
  
  const { cursorCoords, snapshots, currIdx, shapeIsDragging, canvasIsDragging, zoomCenter } = canvasInfo;
  const currentDrawings = snapshots[currIdx];
  const selectedDrawing = currentDrawings.find(drawing => drawing.isSelected);

  const { openDropdown, clickTool, zoomMinThreshold, holdDuration, canvasDragMinThreshold } = toolbar;
  //#endregion

  /** Refs */
  //#region
  const clickedDrawingRef = useRef(null);
  const holdAnimationFrameRef = useRef(null);
  const holdIndicatorRef = useRef(null);
  const mouseXRef = useRef(null);
  const stageRef = useRef(null);
  const timerStartRef = useRef(null);
  const touchDataRef = useRef(null);
  //#endregion

  /** Window resizing */
  //#region
  useEffect(() => {
    const handleResize = () => {
      const stage = stageRef.current;
      if (stage !== null) {
        stage.height(window.innerHeight);
        stage.width(window.innerWidth);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  //#endregion

  return (
    <Stage
      ref={stageRef}

      width={window.innerWidth}
      height={window.innerHeight}

      onWheel={handleWheel}
      onMouseDown={handlePressStart}
      // onTouchStart={handlePressStart}
      onMouseMove={handlePressMove}
      // onTouchMove={handlePressMove}
      onMouseUp={handlePressEnd}
      // onTouchEnd={handlePressEnd}
      onMouseLeave={handleMouseLeave}
    >
      <Layer><AllDrawings/></Layer>

      <Layer><Mask/></Layer>

      <Layer><Axes/></Layer>

      { cursorCoords !== null && 
        <Layer><Cursor holdIndicatorRef={holdIndicatorRef}/></Layer>
      }
    </Stage>
  );

  /** Event handlers */
  //#region
  function handlePressStart(konvaEvent) {
    const event = konvaEvent.evt;

    const shouldExitEarly = pressStartEarlyExitCheck(event);
    if (shouldExitEarly) return;
   
    const coords = getCurrentCoords(konvaEvent);
    universalDispatch({ type: 'setCursorCoords', coords });
    mouseXRef.current = coords.canvasX;

    const drawingWasClicked = checkForDrawingClick(konvaEvent);
    if (drawingWasClicked) return;

    // if (clickTool === null) {
    //   universalDispatch({ type: "addActiveToast", toastName: "noClickToolError" });
    //   return;
    // }

    clickedDrawingRef.current = null;
    doPressHoldCheck(coords);
  }
  function pressStartEarlyExitCheck(event) {
    const isPinchGesture = event.touches && event.touches.length === 2;
    if (isPinchGesture) {
      handlePinchStart(event);
      return true;
    }

    if (openDropdown !== null) {
      universalDispatch({ type: "toggleDropdown", dropdownName: null })
      return true;
    }

    const outOfBounds = cursorCoords !== null && cursorCoords.mathY < 0;
    if (outOfBounds) return true;

    return false;
  }
  function checkForDrawingClick(konvaEvent) {
    let drawingWasClicked = true;

    const konvaShape = konvaEvent.target;
    const stageWasClicked = konvaShape === konvaShape.getStage();
    if (stageWasClicked) {
      drawingWasClicked = false;
    }

    const drawingId = konvaShape.getParent()?.id();
    if (drawingId === undefined) {
      drawingWasClicked = false;
    }

    if (drawingWasClicked) {
      const prevSelected = currentDrawings.find(drawing => drawing.isSelected);
      const clickedPrevSelected = prevSelected && prevSelected.id === drawingId;
      clickedDrawingRef.current = clickedPrevSelected ? null : konvaShape;
    }

    return drawingWasClicked;
  }
  function doPressHoldCheck(coords) {
    const activePointCount = currentDrawings.reduce((count, drawing) => {
      return drawing.isActive ? count + 1 : count
    }, 0);
    timerStartRef.current = performance.now();
    holdAnimationFrameRef.current = requestAnimationFrame(checkIfHolding);

    function checkIfHolding() {
      const duration = performance.now() - timerStartRef.current;

      if (holdIndicatorRef.current !== null) {
        const indicatorAngle = 360 * (duration / holdDuration);
        holdIndicatorRef.current.angle(indicatorAngle);
      }

      if (duration < holdDuration) {
        holdAnimationFrameRef.current = requestAnimationFrame(checkIfHolding);
        return;
      }

      cancelAnimationFrame(holdAnimationFrameRef.current);
      if (holdIndicatorRef.current !== null) {
        holdIndicatorRef.current.angle(0);
      }

      const currentlyDraggingCanvas = mouseXRef.current !== cursorCoords?.canvasX;
      if (currentlyDraggingCanvas) return;

      if (clickTool === 'polygon') {
        if (activePointCount < 2) {
          universalDispatch({ type: 'addActiveToast', toastName: 'polygonError' });
        } else {
          const newDrawing = createDrawing(currentDrawings, toolbar, coords, true);
          universalDispatch({ type: 'addNewDrawing', newDrawing });
        }
      }
    }
  }

  function handlePressMove(konvaEvent) {
    const event = konvaEvent.evt;

    if (event.touches && event.touches.length === 2) {
      handlePinchMove(event);
      return;
    }

    const coords = getCurrentCoords(konvaEvent);
    doUpdateCursorCoords(coords);

    const shouldExitEarly = pressMoveEarlyExitCheck()
    if (shouldExitEarly) return;

    const displacementX = coords.canvasX - mouseXRef.current;
    const underThreshold = Math.abs(displacementX) < canvasDragMinThreshold;
    if (underThreshold) return true;

    mouseXRef.current = coords.canvasX;
    universalDispatch({
      type: "canvasDragStart",
      displacementX
    });
  }
  function doUpdateCursorCoords(coords) {
    // When a shape is dragging the coords are already being updated,
    // so we don't need to do it here as well.
    if (!shapeIsDragging) {
      universalDispatch({ type: 'setCursorCoords', coords });
    }
  }
  function pressMoveEarlyExitCheck() {
    const didNotPress = mouseXRef.current === null;
    const someDrawingClicked = clickedDrawingRef.current !== null;
    const someDrawingSelected = selectedDrawing !== undefined;
    if (didNotPress || someDrawingClicked || someDrawingSelected) return true;

    return false;
  }

  function handlePressEnd(konvaEvent) {
    const coords = getCurrentCoords(konvaEvent);
    universalDispatch({ 
      type: 'setCursorCoords', 
      coords: IS_TOUCH_DEVICE ? null : coords
    });

    if (!canvasIsDragging) {
      if (clickTool === null) {
        universalDispatch({ type: "addActiveToast", toastName: "noClickToolError" });
      } else if (!shapeIsDragging) {
        doNewDrawingCheck(coords);
        doNewSelectionCheck();
      }
    }

    doPressCleanUp();
  }
  function doNewDrawingCheck(coords) {
    const duration = performance.now() - timerStartRef.current;
    const nothingAlreadySelected = selectedDrawing === undefined;
    if (duration < holdDuration && nothingAlreadySelected) {
      const newDrawing = createDrawing(currentDrawings, toolbar, coords, false);
      universalDispatch({ type: 'addNewDrawing', newDrawing });
    }
  }
  function doNewSelectionCheck() {
    const clickedDrawing = clickedDrawingRef.current;
    const clickedDrawingId = clickedDrawing?.getParent().id();

    universalDispatch({ type: "updateSelection", clickedDrawingId });
  }
  function doPressCleanUp() {
    if (holdIndicatorRef.current !== null) {
      holdIndicatorRef.current.angle(0);
    }

    if (holdAnimationFrameRef.current !== null) {
      cancelAnimationFrame(holdAnimationFrameRef.current)
      holdAnimationFrameRef.current = null;
    }

    touchDataRef.current = null;
    mouseXRef.current = null;
    if (canvasIsDragging) {
      universalDispatch({ type: 'canvasDragEnd' });
    }
  }

  function handleMouseLeave() {
    mouseXRef.current = null;
    universalDispatch({ type: "setCursorCoords", coords: null });
  }

  function handleWheel(konvaEvent) {
    const event = konvaEvent.evt;
    event.preventDefault();

    const deltaY = event.deltaY;
    if (cursorCoords !== null && Math.abs(deltaY) >= zoomMinThreshold) {
      universalDispatch({ 
        type: "zooming", 
        delta: deltaY, 
        zoomCenter: cursorCoords
      });
    };
  }

  function handlePinchStart(event) {
    event.preventDefault();

    touchDataRef.current = {
      center: getCenter(...event.touches),
      separation: getSeparation(...event.touches)
    };
  }
  function getCenter(touch1, touch2) {
    return (touch1.clientX + touch2.clientX) / 2;
  }
  function getSeparation(touch1, touch2) {
    return Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
  }

  function handlePinchMove(event) {
    event.preventDefault();

    const newSeparation = getSeparation(...event.touches);
    if (touchDataRef.current === null) {
      touchDataRef.current = {
        center: getCenter(...event.touches),
        separation: newSeparation
      };
      return;
    }

    const touchData = touchDataRef.current;
    const deltaSeparation = touchData.separation - newSeparation;
    if (Math.abs(deltaSeparation) >= zoomMinThreshold) {
      universalDispatch({
        type: 'zooming',
        delta: deltaSeparation,
        center: getMathCoords(touchData.center)
      });
    }

  }
  //#endregion
}