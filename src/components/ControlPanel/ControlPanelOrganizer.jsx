import { useContext, useEffect, useMemo, useRef } from "react";

import ControlPanel from "./ControlPanel";
import StyleControls from "./StyleControls";
import AnimationControls from "./AnimationControls";
import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function ControlPanelOrganizer() {
  const { controlPanels } = useContext(UniversalStateContext);

  const panelNodesRef = useRef(null);
  
  useEffect(() => {
    if (controlPanels.length < 2) {
      return;
    }

    let horzBuffer = 0;
    const panelNodes = getPanelNodesMap();

    controlPanels.forEach((panel, idx) => {
      const { key, wasDragged } = panel;

      if (wasDragged) return;

      const node = panelNodes.get(key);
      const panelWidth = parseFloat(getComputedStyle(node).getPropertyValue('width'));
      if (idx === 0) {
        horzBuffer += panelWidth;
        return;
      }

      node.style.left = `${horzBuffer}px`;
      horzBuffer += panelWidth;
    });
  }, [controlPanels]);

  const containerStyle = { position: "fixed", zIndex: "10", margin: "1rem" };

  return controlPanels.map(({ key, title, placement }) => (
    <div
      key={key}
      ref={(node) => {
        const panelsMap = getPanelNodesMap();
        panelsMap.set(key, node);

        return () => {
          panelsMap.delete(key);
        };
      }}
      style={{ ...containerStyle, ...placement }}
    >
      <ControlPanel title={title}>
        { title === "Animations" ? <AnimationControls/> : <StyleControls/>}
      </ControlPanel>
    </div>
  ));

  function getPanelNodesMap() {
    if (panelNodesRef.current === null) {
      panelNodesRef.current = new Map();
    }
    return panelNodesRef.current;
  }
}