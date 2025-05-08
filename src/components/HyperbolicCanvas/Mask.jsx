import { useContext } from "react";

import { Rect } from "react-konva";

import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function Mask() {
  const { canvasInfo, toolbar } = useContext(UniversalStateContext)
  const { originCoords } = canvasInfo;
  const { darkMode } = toolbar;

  return (
    <Rect
      y={originCoords.y}
      width={window.innerWidth}
      height={window.innerHeight - originCoords.y}
      fill={darkMode ? "rgb(33, 37, 41)" : "rgb(255, 255, 255)"}
      style={{cursor: "not-allowed"}}
    />
  );
}