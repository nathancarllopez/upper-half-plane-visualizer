import { useContext } from "react";

import Button from "react-bootstrap/Button";

import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function AxesResetButton() {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);

  const { unitsPerPixel, originCoords } = canvasInfo;

  return (
    <>
    { (unitsPerPixel !== 1 || originCoords.x !== window.innerWidth / 2) &&
      <Button
        onClick={handlePress}
        onTouchStart={handlePress}
        variant="primary"
        size="lg"
        className="fs-6"
      >
        Reset Axes
      </Button>
    }
    </>
  );

  function handlePress() {
    universalDispatch({ type: "resetAxes" })
  }
}