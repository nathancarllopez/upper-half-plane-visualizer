import { useContext } from "react";

import Axis from "./Axis";
import AxisTick from "./AxisTick";
import getAxisTickInfo from "./getAxisTickInfo";
import { UniversalStateContext } from "../../../contexts/UniversalStateProvider";

export default function Axes() {
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);

  const { originCoords, unitsPerPixel } = canvasInfo
  const { showAxisTicks, axisTickSeparation } = toolbar;

  const horzEndPoints = [0, originCoords.y, window.innerWidth, originCoords.y];
  const vertEndPoints = [originCoords.x, 0, originCoords.x, originCoords.y];
  
  if (!showAxisTicks) {
    return (
      <>
        <Axis endPoints={horzEndPoints}/>
        <Axis endPoints={vertEndPoints}/>
      </>
    );
  }

  const { vertTicks, posHorzTicks, negHorzTicks } = getAxisTickInfo(originCoords, axisTickSeparation, unitsPerPixel);

  return (
    <>
      <Axis endPoints={vertEndPoints}/>
      { vertTicks.map(({ position, label }, idx) =>
        <AxisTick
          key={idx}
          position={position}
          label={label}
          isHorizontal={false}
        />
      )}

      <Axis endPoints={horzEndPoints}/>
      { posHorzTicks.map(({ position, label }, idx) => 
        <AxisTick
          key={idx}
          position={position}
          label={label}
        />
      )}
      { negHorzTicks.map(({ position, label }, idx) => 
        <AxisTick
          key={idx}
          position={position}
          label={label}
        />
      )}
    </>
  );
}