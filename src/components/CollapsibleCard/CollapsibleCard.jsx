import { useContext, useEffect, useRef, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Collapse from "react-bootstrap/Collapse";
import Container from "react-bootstrap/Container";

import { IS_TOUCH_DEVICE } from "../../util/constants";
import upArrow from "../../assets/collapsible-card-up.svg";
import downArrow from "../../assets/collapsible-card-down.svg";
import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function CollapsibleCard({ title, isOpen, toggleIsOpen, children }) {
  // const [hasScrolled, setHasScrolled] = useState(false);

  // const wrapperRef = useRef(null);

  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     console.log(event);
  //     console.log(event.target);
  //   };

  //   document.addEventListener('scroll', handleScroll);

  //   const wrapper = wrapperRef.current;
  //   if (wrapper === null) return;

  //   wrapper.addEventListener('scroll', handleScroll);

  //   return () => {
  //     document.removeEventListener('scroll', handleScroll);
  //     wrapper.removeEventListener('scroll', handleScroll);
  //   }
  // }, []);

  const { toolbar } = useContext(UniversalStateContext);
  const { darkMode } = toolbar;

  const rowStyles = { zIndex: 100, background: darkMode ? "rgb(33, 37, 41)" : "rgb(255, 255, 255)", cursor: "pointer" };

  return (
    <Container className="border rounded">
      {/* <div ref={wrapperRef} id="row-wrapper" style={rowStyles}> */}
      <Row
        className={'align-items-center gx-0 position-sticky top-0'}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        style={rowStyles}
        aria-controls="collapse-container"
        aria-expanded={ isOpen }
      >
        <Col>
          { IS_TOUCH_DEVICE ? <h6 className='mb-0'>{title}</h6> : <h5 className='mb-0'>{title}</h5> }
        </Col>
        <Col className="col-auto">
          <button id="collapseToggle" className="btn">
            <Image src={ isOpen ? downArrow : upArrow }/>
          </button>
        </Col>
      </Row>
      {/* </div> */}

      <Row>
        <Col>
          <Collapse in={isOpen}>
            {/* This extra div helps Bootstrap React make the collapse animation smooth */}
            <div id="collapse-container">
              <hr className="my-2"/>
              <Card className='border-0'>
                <Card.Body className='p-1'>
                  { children }
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );

  function handleClick() {
    if (IS_TOUCH_DEVICE) return;
    toggleIsOpen(title);
  }

  function handleTouchStart() {
    if (IS_TOUCH_DEVICE) {
      toggleIsOpen(title);
    }
  }
}