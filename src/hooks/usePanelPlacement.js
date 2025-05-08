import { useEffect, useState } from "react";

export default function usePanelPlacement(showAnimationPanel, showStylesPanel, animationPanelRef, stylesPanelRef) {
  const [panelPlacement, setPanelPlacement] = useState(INITIAL_PLACEMENT)

  useEffect(() => {
    if (!showAnimationPanel && !showStylesPanel) {
      setPanelPlacement(INITIAL_PLACEMENT);
      return;
    }

    const visiblePanels = Object.entries(panelPlacement).filter(([_, placement]) => placement !== null);

    // If there are no visible panels already, then only one panel can appear
    // because you can't place an animation shape and select a shape in a single
    // rendering cycle. That is, this block will not lead to overlapping panels.
    if (visiblePanels.length === 0) {
      setPanelPlacement({
        animations: showAnimationPanel ? DEFAULT_PLACEMENT : null,
        styles: showStylesPanel ? DEFAULT_PLACEMENT : null
      });
    }

    // If there is a single visible panel and we don't need to show the second
    // panel, then we can stop. If we do need to show the second panel, then we
    // determine its placement based on whether the visible panel has been
    // dragged or not.
    if (visiblePanels.length === 1) {
      const [name, placement] = visiblePanels[0];
      const showPanel = name === "animations" ? showAnimationPanel : showStylesPanel;
      const otherName = name === "animations" ? "styles" : "animations";
      const showOtherPanel = otherName === 'animations' ? showAnimationPanel : showStylesPanel;

      if (!showOtherPanel) return;

      if (!isDefaultPlacement(placement)) {
        setPanelPlacement({
          [name]: showPanel ? placement : null,
          [otherName]: DEFAULT_PLACEMENT
        });
      }

      else {
        const panelDomNode = name === "animations" ? animationPanelRef.current : stylesPanelRef.current;
        const panelWidth = parseFloat(getComputedStyle(panelDomNode).getPropertyValue('width'));
        setPanelPlacement({
          [name]: showPanel ? placement : null,
          [otherName]: { bottom: 0, left: `${panelWidth}px` }
        });
      }
    }

    // If there are two visible panels, then we can use the flags determined above
    // to set their position
    if (visiblePanels.length === 2) {
      setPanelPlacement(prev => {
        const { animations: animPlacement, styles: stylePlacement } = prev;
        return {
          animations: showAnimationPanel ? animPlacement : null,
          styles: showStylesPanel ? stylePlacement : null
        };
      });
    }
  }, [showAnimationPanel, showStylesPanel]);

  return [panelPlacement, setPanelPlacement];
}

const DEFAULT_PLACEMENT = { bottom: 0, left: 0 };
const INITIAL_PLACEMENT = {
  animations: null,
  styles: null
};

function isDefaultPlacement(placement) {
  const keys = Object.keys(placement);
  for (const key of keys) {
    if (!Object.hasOwn(DEFAULT_PLACEMENT, key)) return false;
    if (placement[key] !== DEFAULT_PLACEMENT[key]) return false;
  }
  return true;
}