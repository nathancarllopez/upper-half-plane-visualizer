import { useCallback, useContext, useEffect, useRef } from "react";
import { UniversalStateContext } from "../contexts/UniversalStateProvider";

export default function useAnimationShape(animationShapeRef, rotationFunc) {
  const { canvasInfo } = useContext(UniversalStateContext);
  const { isAnimating, animationSpeed } = canvasInfo;
  
  const animationFrameRef = useRef(null);
  const timerStartRef = useRef(null);

  const startAnimation = useCallback(() => {
    const doAnimation = () => {
      const animationShape = animationShapeRef.current;
      if (!isAnimating || animationShape === null) return;

      const deltaT = (performance.now() - timerStartRef.current) / 1000;
      const degrees = animationSpeed * deltaT;

      if (animationShape.rotation) {
        const currRotation = animationShape.rotation();
        animationShape.rotation(rotationFunc(currRotation, degrees));
      }

      timerStartRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(doAnimation);
    }

    const animationShape = animationShapeRef.current;
    if (animationShape === null) return;

    timerStartRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(doAnimation);
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