import { useContext, useEffect } from "react";

import Button from "react-bootstrap/Button";

import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function HistoryButtons() {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);

  const { snapshots, currIdx } = canvasInfo;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const commandPressed = event.metaKey || event.ctrlKey;
      if (commandPressed) {
        if (event.key === 'y') {
          if (currIdx === snapshots.length - 1) {
            universalDispatch({ type: "addActiveToast", toastName: "redoError" });
          } else {
            event.preventDefault();
            universalDispatch({ type: "redo" });
          }
        } else if (event.key === 'z') {
          if (event.shiftKey) {
            if (currIdx === snapshots.length - 1) {
              universalDispatch({ type: "addActiveToast", toastName: "redoError" });
            } else {
              event.preventDefault();
              universalDispatch({ type: "redo" });
            }
          } else {
            if (currIdx === 0) {
              universalDispatch({ type: "addActiveToast", toastName: "undoError" });
            } else {
              event.preventDefault();
              universalDispatch({ type: "undo" });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [currIdx, snapshots]);

  const buttonInfo = [
    {
      name: 'undo',
      label: "Undo",
      disabled: currIdx === 0,
      onPress: () => universalDispatch({ type: "undo" }),
    },
    {
      name: 'redo',
      label: "Redo",
      disabled: currIdx === snapshots.length - 1,
      onPress: () => universalDispatch({ type: "redo" })
    },
    {
      name: 'clear',
      label: "Clear",
      disabled: snapshots[currIdx].length === 0,
      onPress: () => universalDispatch({ type: "clear" })
    }
  ];

  return (
    <>
    { buttonInfo.map(({ name, label, disabled, onPress }) => (
      <Button
        key={name}
        disabled={disabled}
        onClick={onPress}
        onTouchStart={onPress}
        variant={ disabled ? "secondary" : "primary" }
        size="lg"
        className="fs-6"
      >
        { label }
      </Button>
    )) }
    </>
  );
}