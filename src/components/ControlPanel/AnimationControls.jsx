import { useContext } from "react";

import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import ControlPanel from "./ControlPanel";
import playIcon from "../../assets/play-fill.svg";
import pauseIcon from "../../assets/pause-fill.svg";
import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import { Col, Container, Row } from "react-bootstrap";

export default function AnimationControls() {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);

  const { isAnimating, animationSpeed } = canvasInfo;

  return (
    <Stack gap={2}>
      <Container>
        <Row>
          <Col>
            <Button
              onClick={handlePlayPausePress}
              onTouchStart={handlePlayPausePress}
            >
              <Image src={isAnimating ? pauseIcon : playIcon}/>
            </Button>
          </Col>
          <Col>
            <Button
              onClick={handleAnimSpeedFlip}
              onTouchStart={handleAnimSpeedFlip}
              className="ms-auto"
            >
              Reverse
            </Button>
          </Col>
        </Row>
      </Container>

      <InputGroup>
        <Form.Control
          type="number"
          id="animationSpeed"
          value={animationSpeed}
          min={-1000}
          max={1000}
          onChange={handleAnimSpeedChange}
        />
        <InputGroup.Text>deg/sec</InputGroup.Text>
      </InputGroup>
    </Stack>
  );

    function handlePlayPausePress() {
      universalDispatch({ type: "toggleIsAnimating" });
    }

    function handleAnimSpeedFlip() {
      universalDispatch({ type: "flipAnimationSpeed" });
    }

    function handleAnimSpeedChange(event) {
      const newSpeed = parseInt(event.target.value);

      universalDispatch({ type: "changeAnimationSpeed", newSpeed });
    }
}

/** 
 * Working version but overlaps
 */
// export default function AnimationControls() {
//   const universalDispatch = useContext(UniversalStateDispatchContext);
//   const { canvasInfo } = useContext(UniversalStateContext);

//   const { isAnimating, animationSpeed, snapshots, currIdx } = canvasInfo;
//   const animationShapePlaced = snapshots[currIdx].some(drawing => drawing.isAnimationShape);

//   return (
//     <>
//     { animationShapePlaced &&
//       <ControlPanel title="Controls">
        // <Stack gap={2}>
        //   <Container>
        //     <Row>
        //       <Col>
        //         <Button
        //           onClick={handlePlayPausePress}
        //           onTouchStart={handlePlayPausePress}
        //         >
        //           <Image src={isAnimating ? pauseIcon : playIcon}/>
        //         </Button>
        //       </Col>
        //       <Col>
        //         <Button
        //           onClick={handleAnimSpeedFlip}
        //           onTouchStart={handleAnimSpeedFlip}
        //           className="ms-auto"
        //         >
        //           Reverse
        //         </Button>
        //       </Col>
        //     </Row>
        //   </Container>

        //   <InputGroup>
        //     <Form.Control
        //       type="number"
        //       id="animationSpeed"
        //       value={animationSpeed}
        //       min={-1000}
        //       max={1000}
        //       onChange={handleAnimSpeedChange}
        //     />
        //     <InputGroup.Text>deg/sec</InputGroup.Text>
        //   </InputGroup>
        // </Stack>
//       </ControlPanel>
//     }
//     </>
//   );

//   function handlePlayPausePress() {
//     universalDispatch({ type: "toggleIsAnimating" });
//   }

//   function handleAnimSpeedFlip() {
//     universalDispatch({ type: "flipAnimationSpeed" });
//   }

//   function handleAnimSpeedChange(event) {
//     const newSpeed = parseInt(event.target.value);

//     universalDispatch({ type: "changeAnimationSpeed", newSpeed });
//   }
// }

/** 
 * Attempt using the usePanelPlacement hook
 */
// export default function AnimationControls({ placement, animationPanelRef, onDragStop }) {
//   const universalDispatch = useContext(UniversalStateDispatchContext);
//   const { canvasInfo } = useContext(UniversalStateContext);

//   const { isAnimating, animationSpeed } = canvasInfo;

//   return (
//     <div ref={animationPanelRef}>
//       <ControlPanel title="Controls" placement={placement} onDragStop={onDragStop}>
//         <Stack gap={2}>
//           <Container>
//             <Row>
//               <Col>
//                 <Button
//                   onClick={handlePlayPausePress}
//                   onTouchStart={handlePlayPausePress}
//                 >
//                   <Image src={isAnimating ? pauseIcon : playIcon}/>
//                 </Button>
//               </Col>
//               <Col>
//                 <Button
//                   onClick={handleAnimSpeedFlip}
//                   onTouchStart={handleAnimSpeedFlip}
//                   className="ms-auto"
//                 >
//                   Reverse
//                 </Button>
//               </Col>
//             </Row>
//           </Container>

//           <InputGroup>
//             <Form.Control
//               type="number"
//               id="animationSpeed"
//               value={animationSpeed}
//               min={-1000}
//               max={1000}
//               onChange={handleAnimSpeedChange}
//             />
//             <InputGroup.Text>deg/sec</InputGroup.Text>
//           </InputGroup>
//         </Stack>
//       </ControlPanel>
//     </div>
//   );

//   function handlePlayPausePress() {
//     universalDispatch({ type: "toggleIsAnimating" });
//   }

//   function handleAnimSpeedFlip() {
//     universalDispatch({ type: "flipAnimationSpeed" });
//   }

//   function handleAnimSpeedChange(event) {
//     const newSpeed = parseInt(event.target.value);

//     universalDispatch({ type: "changeAnimationSpeed", newSpeed });
//   }
// }