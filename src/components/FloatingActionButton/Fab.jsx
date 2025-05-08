import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import infoIcon from "../../assets/info.svg";
import toolIcon from "../../assets/tools.svg";
import closeIcon from "../../assets/x.svg";
import { useContext } from "react";
import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function Fab({ fabName, onFabPress }) {
  const { toolbar } = useContext(UniversalStateContext);
  const { darkMode } = toolbar;

  const { src, alt, placement, size } = FAB_INFO[fabName];

  return (
    <div style={{ zIndex: "10", margin: "1rem", position: "fixed", ...placement }}>
      <Button
        variant={darkMode ? "dark" : "info"}
        className="rounded-circle border"
        onClick={handleFabPress}
        onTouchStart={handleFabPress}
        size={size}
        style={{cursor: "pointer !important"}}
      >
        <Image src={src} alt={alt}/>
      </Button>
    </div>
  );

  function handleFabPress() {
    onFabPress();
  }
}

const FAB_INFO = {
  "Information": {
    src: infoIcon,
    alt: "Open Information Drawer",
    placement: { top: 0, left: 0 },
    size: "lg"
  },
  "Toolbar": {
    src: toolIcon,
    alt: "Expand Toolbar Button",
    placement: { top: 0, right: 0 },
    size: "lg"
  },
  "Collapse": {
    src: closeIcon,
    alt: "Collapse Button",
    placement: { position: "absolute", right: "-2rem", top: "-2rem" },
    size: "sm"
  }
};

// export default function Fab({ fabName, pressOverride = null, size = "lg" }) {
//   const universalDispatch = useContext(UniversalStateDispatchContext);
  
//   const { src, alt, placement } = FAB_INFO[fabName];

//   return (
//     <div style={{ zIndex: "10", margin: "1rem", position: "fixed", ...placement }}>
//       <Button
//         variant="primary"
//         className="rounded-circle"
//         onClick={handleFabPress}
//         onTouchStart={handleFabPress}
//         size={size}
//       >
//         <Image src={src} alt={alt}/>
//       </Button>
//     </div>
//   );

//   function handleFabPress() {
//     if (pressOverride !== null) {
//       pressOverride();
//     } else {
//       universalDispatch({ type: "fabPress", fabName });
//       // universalDispatch({ type: "clearActiveAndAnimation" });
//     }
//   }
// }