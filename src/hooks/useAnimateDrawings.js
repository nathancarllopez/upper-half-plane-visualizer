import { useCallback, useContext, useEffect, useRef } from "react";
import { UniversalStateContext, UniversalStateDispatchContext } from "../contexts/UniversalStateProvider";

export default function useAnimateDrawings(animationShapeRef, animationFuncRef) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);

  const animationFrameRef = useRef(null);
  const timerStartRef = useRef(null);

  const { isAnimating, animationSpeed } = canvasInfo;

  const startAnimation = useCallback(() => {
    const doAnimation = () => {
      const animationShape = animationShapeRef.current;
      if (!isAnimating || animationShape === null) return;

      const deltaT = (performance.now() - timerStartRef.current) / 1000;
      const deltaPos = (() => {
        switch(animationShape.name) {
          case "rotation": {
            const radiansPerSecond = animationSpeed * (Math.PI / 180);
            const radiansToMove = radiansPerSecond * deltaT;
            return radiansToMove
          }
  
          case "translation": {
            return animationSpeed * deltaT * (TRANSLATION_DAMPENER);
          }
  
          default: {
            throw new Error(`Could not identify animation shape while animating: ${animationShape}`);
          }
        }
      })();
      
      const animationFunc = animationFuncRef.current;
      universalDispatch({ type: "animateDrawings", animationFunc, deltaPos });

      // universalDispatch({
      //   type: "transformDrawings",
      //   mapFunc: drawing => animationFuncRef.current(drawing, deltaPos)
      // });

      animationFrameRef.current = requestAnimationFrame(doAnimation);
      timerStartRef.current = performance.now();
    }

    const animationShape = animationShapeRef.current;
    if (animationShape === null) return;

    universalDispatch({ type: "copyDrawings" });

    animationFrameRef.current = requestAnimationFrame(doAnimation);
    timerStartRef.current = performance.now();
  }, [isAnimating, animationSpeed]);

  useEffect(() => {
    if (isAnimating) {
      animationFrameRef.current = requestAnimationFrame(startAnimation);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isAnimating, startAnimation]);
}

const TRANSLATION_DAMPENER = 1/100;