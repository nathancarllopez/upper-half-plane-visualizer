import { useContext } from "react";

import { Arc, Text } from "react-konva";

import { IS_TOUCH_DEVICE } from "../../util/constants";
import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function Cursor({ holdIndicatorRef }) {
  const { canvasInfo, toolbar } = useContext(UniversalStateContext)

  const { cursorCoords } = canvasInfo;
  const { clickTool, showCursorCoords, decimalPlaceCount } = toolbar;

  const coordText = `(${cursorCoords.mathX.toFixed(decimalPlaceCount)}, ${cursorCoords.mathY.toFixed(decimalPlaceCount)})`;

  return (
    <>
      { showCursorCoords && cursorCoords &&
        <Text
          x={cursorCoords.canvasX}
          y={cursorCoords.canvasY}
          fontSize={CURSOR_FONT_SIZE}
          offsetX={(IS_TOUCH_DEVICE ? -20 : -5)}
          offsetY={(IS_TOUCH_DEVICE ? CURSOR_FONT_SIZE * 2 : CURSOR_FONT_SIZE * 1.1)}
          text={coordText}
          fill={CURSOR_COORD_COLOR}
        />
      }
      { clickTool === 'polygon' && cursorCoords && 
        <Arc
          ref={holdIndicatorRef}
          x={cursorCoords.canvasX}
          y={cursorCoords.canvasY}
          offsetX={IS_TOUCH_DEVICE ? 20 : 40}
          innerRadius={8}
          outerRadius={16}
          fill={'orange'}
        />
      }
    </>
  );
}

const CURSOR_FONT_SIZE = 24;
const CURSOR_COORD_COLOR = "white";