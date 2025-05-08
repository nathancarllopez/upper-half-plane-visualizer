import { useContext, useMemo, useRef } from "react";

import Point from "./Point";
import Segment from "./Segment";
import Polygon from "./Polygon";
import Geodesic from "./Geodesic";
import Horocycle from "./Horocycle";
import HypCircle from "./HypCircle";
import CenterOfRotation from "./CenterOfRotation";
import AxisOfTranslation from "./AxisOfTranslation";
import useAnimateDrawings from "../../hooks/useAnimateDrawings";
import { AnimationDataContext, CoordFuncContext, UniversalStateContext } from "../../contexts/UniversalStateProvider";
import getAnimationFunction from "./util/getAnimationFunction";

export default function AllDrawings() {
  const { animationShapeRef, animationFuncRef } = useContext(AnimationDataContext);

  useAnimateDrawings(animationShapeRef, animationFuncRef)

  const { getCanvasCoords } = useContext(CoordFuncContext);
  const { canvasInfo } = useContext(UniversalStateContext);
  
  const { snapshots, currIdx } = canvasInfo;
  const currentDrawings = snapshots[currIdx];

  const drawingComponents = useMemo(() => {
    return currentDrawings.map((drawing) => {
      const { id, ...info } = drawing;
      const { name } = info;
  
      switch(name) {
        case 'point': {
          return (
            <Point key={id} id={id} { ...info }/>
          );
        }

        case 'horocycle': {
          return (
            <Horocycle key={id} id={id} { ...info }/>
          );
        }

        case 'geodesic': {
          return (
            <Geodesic key={id} id={id} { ...info }/>
          );
        }

        case 'segment': {
          return (
            <Segment key={id} id={id} { ...info }/>
          );
        }

        case 'polygon': {
          return (
            <Polygon key={id} id={id} { ...info }/>
          );
        }

        case 'circle': {
          return (
            <HypCircle key={id} id={id} { ...info }/>
          );
        }

        case 'rotation': {
          animationFuncRef.current = getAnimationFunction(drawing, getCanvasCoords);
          animationShapeRef.current = drawing;
          
          return (
            <CenterOfRotation key={id} id={id} { ...info }/>
          );
        }

        case 'translation': {
          animationFuncRef.current = getAnimationFunction(drawing, getCanvasCoords);
          animationShapeRef.current = drawing;

          return (
            <AxisOfTranslation key={id} id={id} { ...info }/>
          );
        }
  
        default: {
          throw new Error(`Unexpected drawing name: ${id}, ${info}`);
        }
      }
    });
  }, [currentDrawings]);

  return <>{ drawingComponents }</>;
}