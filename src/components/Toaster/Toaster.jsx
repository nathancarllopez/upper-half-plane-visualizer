import { useContext } from "react";

import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { IS_TOUCH_DEVICE } from "../../util/constants";
import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function Toaster() {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { activeToasts, toolbar } = useContext(UniversalStateContext);

  const { showToolbarInstructions, toastDuration } = toolbar;

  const containerStyle = { bottom: "2rem", right: "1rem" };
  const getToastBackground = (name, idx) => {
    if (name.includes("Error")) {
      return "danger";
    } else if (idx === activeToasts.length - 1) {
      return "primary";
    }
    return undefined;
  }

  return (
    <ToastContainer style={containerStyle}>
      { activeToasts.map(({ name, key }, idx) => (
        <Toast
          key={key}
          bg={getToastBackground(name, idx)}
          onClose={handleClose}
          show={name.includes("Error") ? true : showToolbarInstructions}
          delay={toastDuration}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{ALL_TOAST_INFO[name].header}</strong>
          </Toast.Header>
          <Toast.Body>{ALL_TOAST_INFO[name].body}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );

  function handleClose() {
    universalDispatch({ type: "removeOldToast" });
  }
}

const CLICK_TAP = IS_TOUCH_DEVICE ? "Tap" : "Click";
const ALL_TOAST_INFO = {
  undoError: {
    header: "Cannot Undo Error",
    body: "There are no actions to undo."
  },
  redoError: {
    header: "Cannot Redo Error",
    body: "There are no actions to redo."
  },
  noClickToolError: {
    header: "No Click Tool Error",
    body: "Select a drawing or animation from the toolbar.",
  },
  polygonError: {
    header: "Polygon Error",
    body: "A polygon needs at least three vertices.",
  },
  point: {
    header: "Point tool selected",
    body: `${CLICK_TAP} once to place a point.`,
  },
  geodesic: {
    header: "Line tool selected",
    body: `${CLICK_TAP} twice to draw a line.`,
  },
  segment: {
    header: "Line Segment tool selected",
    body: `${CLICK_TAP} twice to draw a line segment.`,
  },
  polygon: {
    header: "Polygon tool selected",
    body: `${CLICK_TAP} as many times as you'd like to draw a polygon. ${CLICK_TAP} and hold to place the last vertex.`,
  },
  circle: {
    header: "Circle tool selected",
    body: `${CLICK_TAP} twice to draw a circle, first for the center and second to determine the radius.`,
  },
  horocycle: {
    header: "Horocycle tool selected",
    body: `${CLICK_TAP} once to draw a horocycle tangent to the x-axis below where you clicked.`,
  },
  rotation: {
    header: "Rotation tool selected",
    body: `${CLICK_TAP} once to choose the center of rotation.`,
  },
  translation: {
    header: "Translation tool selected",
    body: `${CLICK_TAP} twice to draw the axis of translation.`,
  },
}