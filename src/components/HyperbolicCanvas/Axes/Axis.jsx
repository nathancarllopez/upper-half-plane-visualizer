import { Line } from "react-konva";

import { AXES_COLOR, AXES_STROKE_WIDTH } from "./axesConstants";

export default function Axis({ endPoints }) {
  return (
    <Line
      points={endPoints}
      stroke={AXES_COLOR}
      strokeWidth={AXES_STROKE_WIDTH}
    />
  );
}