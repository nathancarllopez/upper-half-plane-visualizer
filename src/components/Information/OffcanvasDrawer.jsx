import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";

import Fab from "../FloatingActionButton/Fab";

export default function OffcanvasDrawer({ fabName, children }) {
  const [show, setShow] = useState(false);

  return (
    <>
    <Fab fabName={fabName} onFabPress={() => setShow(true)}/>
    
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="start"
      style={{ width: "30vw" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fs-1">{fabName}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>{ children }</Offcanvas.Body>
    </Offcanvas>
    </>
  );
}