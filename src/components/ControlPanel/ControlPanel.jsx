import { useContext, useRef, useState } from "react";

import Draggable from "react-draggable";

import CollapsibleCard from "../CollapsibleCard/CollapsibleCard";
import { UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

export default function ControlPanel({ title, children }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const nodeRef = useRef(null);
  const startCoordsRef = useRef(null);
  const endCoordsRef = useRef(null);

  return (
    <Draggable 
      nodeRef={nodeRef}
      cancel="input"
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div ref={nodeRef}>
        <CollapsibleCard
          title={title}
          isOpen={!isCollapsed}
          toggleIsOpen={handleToggleIsOpen}
        >
          { children }
        </CollapsibleCard>
      </div>
    </Draggable>
  );

  function handleDragStart(event) {
    const { pageX, pageY } = event;
    startCoordsRef.current = { startX: pageX, startY: pageY };
  }

  function handleDragStop(event) {
    const { pageX, pageY } = event;
    endCoordsRef.current = { endX: pageX, endY: pageY };
    universalDispatch({ type: "panelDragStop", draggedTitle: title });
  }

  function handleToggleIsOpen() {
    const { startX, startY } = startCoordsRef.current;
    const { endX, endY } = endCoordsRef.current;
    const dragDistance = Math.hypot(endX - startX, endY - startY);

    if (dragDistance > 2) {
      startCoordsRef.current = null;
      endCoordsRef.current = null;
    } else {
      setIsCollapsed(!isCollapsed);
    }
  }
}

// export default function ControlPanel({ title, children }) {
//   const [isOpen, setIsOpen] = useState(true);

//   const nodeRef = useRef(null);

//   const containerStyle = { position: "fixed", zIndex: "10", margin: "1rem", left: 0, bottom: 0 };

//   return (
//     <Draggable nodeRef={nodeRef} cancel="input">
//       <div ref={nodeRef} style={containerStyle}>
//         <CollapsibleCard
//           title={title}
//           isOpen={isOpen}
//           toggleIsOpen={() => setIsOpen(!isOpen)}
//         >
//           { children }
//         </CollapsibleCard>
//       </div>
//     </Draggable>
//   );
// }

// export default function ControlPanel({ title, placement, onDragStop, children }) {
//   const [isOpen, setIsOpen] = useState(true);

//   const nodeRef = useRef(null);

//   const containerStyle = { position: "fixed", zIndex: "10", margin: "1rem", ...placement };

//   return (
//     <Draggable nodeRef={nodeRef} cancel="input" onStop={onDragStop}>
//       <div ref={nodeRef} style={containerStyle}>
//         <CollapsibleCard
//           title={title}
//           isOpen={isOpen}
//           toggleIsOpen={() => setIsOpen(!isOpen)}
//         >
//           { children }
//         </CollapsibleCard>
//       </div>
//     </Draggable>
//   );
// }