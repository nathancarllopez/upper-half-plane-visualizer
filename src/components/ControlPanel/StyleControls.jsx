import { useContext, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import { Container, InputGroup } from "react-bootstrap";

export default function StyleControls() {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { canvasInfo } = useContext(UniversalStateContext);

  const { snapshots, currIdx } = canvasInfo;
  const selectedDrawing = snapshots[currIdx].find(drawing => drawing.isSelected);

  if (selectedDrawing === undefined) {
    throw new Error(`StyleControls rendered without selected drawing`);
  }

  useEffect(() => {
    const handleDeleteKeyDown = (event) => {
      const deleteKeys = ["Delete", "Backspace"];
      if (deleteKeys.includes(event.key)) {
        event.preventDefault();
        handleDeleteDrawing();
      }
    };

    window.addEventListener('keydown', handleDeleteKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleDeleteKeyDown);
    }
    
  }, []);

  const inputInfo = getFormInputInfo();

  return (
    <Container className="p-0">
      { inputInfo.map(({ label, units, ...info }) => (
        <Row
          key={label}
          className='align-items-center mb-2'
        >
          <Col>{label}</Col>
          <Col>
            <InputGroup>
              <Form.Control
                { ...info }
                className="mx-auto"
                onChange={handleDrawingStyleChange}
              />
              { units &&
                <InputGroup.Text>{units}</InputGroup.Text>
              }
            </InputGroup>
          </Col>
        </Row>
      ))}

      <Row>
        <Col>
          <Button 
            className="w-100"
            onClick={handleDeleteDrawing}
            onTouchStart={handleDeleteDrawing}
          >
            Delete
          </Button>
        </Col>
        
      </Row>
    </Container>
  );

  function getFormInputInfo() {
    return [
      { label: "Color", id: "color", type: "color", value: selectedDrawing.styles.color },
      { label: "Width", id: "strokeWidth", type: "number", value: selectedDrawing.styles.strokeWidth, min: 1, max: 100, units: "px" },
      { label: "Point Radius", id: "pointRadius", type: "number", value: selectedDrawing.styles.pointRadius, min: 1, max: 100, units: "px" }
    ];
  }

  function handleDrawingStyleChange(event) {
    const styleName = event.target.id;
    const value = styleName === "color" ?
      event.target.value : parseInt(event.target.value);

    universalDispatch({ type: "changeDrawingStyle", styleName, value, id: selectedDrawing.id });
  }

  function handleDeleteDrawing() {
    universalDispatch({ type: "deleteDrawing", id: selectedDrawing.id });
  }
}

/**
 * Attempt using the usePanelPlacementHook
 */
// export default function StyleControls({ placement, stylesPanelRef, onDragStop }) {
//   const universalDispatch = useContext(UniversalStateDispatchContext);
//   const { canvasInfo } = useContext(UniversalStateContext);

//   const { snapshots, currIdx } = canvasInfo;
//   const selectedDrawing = snapshots[currIdx].find(drawing => drawing.isSelected);

//   console.log('selectedDrawing', selectedDrawing);

//   return (
//     <div ref={stylesPanelRef}>
//       <ControlPanel title={"Style"} placement={placement} onDragStop={onDragStop}>
//         <Form>
//           <Form.Group className="mb-1" as={Row} controlId="color">
//             <Form.Label column>Color</Form.Label>
//             <Col>
//               <Form.Control
//                 type="color"
//                 value={selectedDrawing.styles.color}
//                 onChange={handleDrawingStyleChange}
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group className="mb-1" as={Row} controlId="strokeWidth">
//             <Form.Label column>Width</Form.Label>
//             <Col>
//               <Form.Control
//                 type="number"
//                 value={selectedDrawing.styles.strokeWidth}
//                 onChange={handleDrawingStyleChange}
//                 min={1}
//                 max={100}
//               />
//             </Col>
//           </Form.Group>

//           <Row>
//             <Col>
//               <Button 
//                 onClick={handleDeleteDrawing}
//                 onTouchStart={handleDeleteDrawing}
//               >
//                 Delete Drawing
//               </Button>
//             </Col>
            
//           </Row>
//         </Form>
//       </ControlPanel>
//     </div>
//   );

//   function handleDrawingStyleChange(event) {
//     const styleName = event.target.id;
//     const value = styleName === "strokeWidth" ?
//       parseInt(event.target.value) : event.target.value;

//     universalDispatch({ type: "changeDrawingStyle", styleName, value, id: selectedDrawing.id });
//   }

//   function handleDeleteDrawing() {
//     universalDispatch({ type: "deleteDrawing", id: selectedDrawing.id });
//   }
// }

/**
 * Working version but overlaps
 */
// export default function StyleControls() {
//   const universalDispatch = useContext(UniversalStateDispatchContext);
//   const { canvasInfo } = useContext(UniversalStateContext);

//   const { snapshots, currIdx } = canvasInfo;
//   const selectedDrawing = snapshots[currIdx].find(drawing => drawing.isSelected);

//   return (
//     <>
//     { selectedDrawing !== undefined &&
//       <ControlPanel title={"Style"}>
//         <Form>
//           <Form.Group className="mb-1" as={Row} controlId="color">
//             <Form.Label column>Color</Form.Label>
//             <Col>
//               <Form.Control
//                 type="color"
//                 value={selectedDrawing.styles.color}
//                 onChange={handleDrawingStyleChange}
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group className="mb-1" as={Row} controlId="strokeWidth">
//             <Form.Label column>Width</Form.Label>
//             <Col>
//               <Form.Control
//                 type="number"
//                 value={selectedDrawing.styles.strokeWidth}
//                 onChange={handleDrawingStyleChange}
//                 min={1}
//                 max={100}
//               />
//             </Col>
//           </Form.Group>

//           <Row>
//             <Col>
//               <Button 
//                 onClick={handleDeleteDrawing}
//                 onTouchStart={handleDeleteDrawing}
//               >
//                 Delete Drawing
//               </Button>
//             </Col>
            
//           </Row>
//         </Form>
//       </ControlPanel>
//     }
//     </>
//   );

//   function handleDrawingStyleChange(event) {
//     const styleName = event.target.id;
//     const value = styleName === "strokeWidth" ?
//       parseInt(event.target.value) : event.target.value;

//     universalDispatch({ type: "changeDrawingStyle", styleName, value, id: selectedDrawing.id });
//   }

//   function handleDeleteDrawing() {
//     universalDispatch({ type: "deleteDrawing", id: selectedDrawing.id });
//   }
// }