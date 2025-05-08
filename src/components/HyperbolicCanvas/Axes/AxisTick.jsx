import { useContext } from "react";

import { Line, Text } from "react-konva";

import { AXES_COLOR, AXES_LABEL_FONT_SIZE, AXIS_TICK_LENGTH } from "./axesConstants";
import { UniversalStateContext } from "../../../contexts/UniversalStateProvider";

export default function AxisTick({ position, label, isHorizontal = true }) {
  const { canvasInfo, toolbar } = useContext(UniversalStateContext);
  
  const { originCoords } = canvasInfo;
  const { showAxisTickLabels, decimalPlaceCount } = toolbar;

  const roundedLabel = label.toFixed(decimalPlaceCount);
  const endPoints = isHorizontal ?
    [position, originCoords.y - AXIS_TICK_LENGTH, position, originCoords.y + AXIS_TICK_LENGTH] :
    [originCoords.x - AXIS_TICK_LENGTH, position, originCoords.x + AXIS_TICK_LENGTH, position];
  const labelX = isHorizontal ?
    position + AXES_LABEL_FONT_SIZE / 2 :
    originCoords.x + AXIS_TICK_LENGTH + 5;
  const labelY = isHorizontal ?
    originCoords.y + AXIS_TICK_LENGTH + 5 :
    position - AXES_LABEL_FONT_SIZE / 2;

  return (
    <>
      <Line points={endPoints} stroke={AXES_COLOR}/>

      { showAxisTickLabels &&
        <Text
          x={labelX}
          y={labelY}
          text={roundedLabel}
          fill={AXES_COLOR}
          fontSize={AXES_LABEL_FONT_SIZE}
          rotation={isHorizontal ? 45 : 0}
        />
      }
    </>
  );
}