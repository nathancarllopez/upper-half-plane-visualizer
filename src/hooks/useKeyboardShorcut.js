import { useContext, useEffect } from "react";
import { UniversalStateDispatchContext } from "../contexts/UniversalStateProvider";

export default function useKeyboardShorcut({ type, deleteId = null }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);

  useEffect(() => {
    const keyDownCallbacks = {
      "undo": (event) => {
        const undoPressed = (event.metaKey || event.ctrlKey ) && event.key === 'z';
          if (undoPressed) {
            event.preventDefault();
            universalDispatch({ type: "undo" })
          }
      },
      "delete": (event) => {
        if (deleteId === null) return;

        const deleteKeys = ["Delete", "Backspace"];
        if (deleteKeys.includes(event.key)) {
          event.preventDefault();
          universalDispatch({ type: "deleteDrawing", deleteId })
        }
      },
      // "save": (event) => {},
    }

    const handleKeyDown = keyDownCallbacks[type];
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
}