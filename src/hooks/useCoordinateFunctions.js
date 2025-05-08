import { useCallback } from "react";

export default function useCoordinateFunctions(unitsPerPixel, originCoords) {
  const getCurrentCoords = useCallback((konvaEvent) => {
    const { x, y } = konvaEvent.target.getStage().getPointerPosition();

    return {
      canvasX: x,
      canvasY: y,
      mathX: unitsPerPixel * (x - originCoords.x),
      mathY: unitsPerPixel * (originCoords.y - y)
    }
  }, [unitsPerPixel, originCoords]);

  const getMathCoords = useCallback((canvasX = originCoords.x, canvasY = originCoords.y) => {
    return {
      canvasX,
      canvasY,
      mathX: unitsPerPixel * (canvasX - originCoords.x),
      mathY: unitsPerPixel * (originCoords.y - canvasY)
    };
  }, [unitsPerPixel, originCoords]);

  const getCanvasCoords = useCallback((mathX = 0, mathY = 0) => {
    return {
      canvasX: originCoords.x + mathX / unitsPerPixel,
      canvasY: originCoords.y - mathY / unitsPerPixel,
      mathX,
      mathY
    };
  }, [unitsPerPixel, originCoords]);

  return { getCurrentCoords, getMathCoords, getCanvasCoords };
}