import { useContext } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormCheck from "react-bootstrap/esm/FormCheck";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";
import { InputGroup } from "react-bootstrap";
import { IS_TOUCH_DEVICE } from "../../util/constants";

export default function DropdownForm({ title }) {
  const universalDispatch = useContext(UniversalStateDispatchContext)
  const { toolbar } = useContext(UniversalStateContext);

  const { openDropdown, drawingColor, strokeWidth, pointRadius, holdDuration, toastDuration, axisTickSeparation, decimalPlaceCount, showCursorCoords, showAxisTicks, showAxisTickLabels, showToolbarInstructions, isVertical, darkMode } = toolbar;

  const paddedPlaceCount = (() => {
    if (decimalPlaceCount === 0) return decimalPlaceCount;

    const intPart = decimalPlaceCount.toString();
    return `${intPart}.`.padEnd(decimalPlaceCount + 2, "0");
  })();

  const allDropdownInfo = {
    "Styles": {
      formWidth: "15vw",
      formControls: [
        { label: "Color", id: "drawingColor", type: "color", value: drawingColor },
        { label: "Width", id: "strokeWidth", type: "number", value: strokeWidth, min: 1, max: 100, units: "px" },
        { label: "Point Radius", id: "pointRadius", type: "number", value: pointRadius, min: 1, max: 100, units: "px" },
      ],
    },
    "Settings": {
      formWidth: "30vw",
      formControls: [
        { label: "Polygon Hold Duration", id: 'holdDuration', type: "number", value: holdDuration, min: 1, max: 5000, units: "ms" },
        { label: "Toast Message Duration", id: 'toastDuration', type: "number", value: toastDuration, min: 1, max: 10000, units: "ms" },
        { label: "Axis Tick Separation", id: "axisTickSeparation", type: "number", value: axisTickSeparation, min: 10, max: 1000, units: "px" },
        { label: "Decimal Place Count", id: "decimalPlaceCount", type: "number", value: paddedPlaceCount, min: 0, max: 10 },
      ],
      formSwitches: [
        { label: "Dark Mode", id: "darkMode", isChecked: darkMode },
        { label: "Horizontal Toolbar", id: "isVertical", isChecked: !isVertical },
        { label: "Axis Ticks", id: "showAxisTicks", isChecked: showAxisTicks },
        { label: "Axis Tick Labels", id: "showAxisTickLabels", isChecked: showAxisTickLabels },
        { label: "Instruction Toast Messages", id: "showToolbarInstructions", isChecked: showToolbarInstructions },
      ],
    },
  }
  const { formWidth, formControls, formSwitches } = allDropdownInfo[title];

  if (formSwitches && !IS_TOUCH_DEVICE) {
    formSwitches.push({ label: "Cursor Coordinates", id: "showCursorCoords", isChecked: showCursorCoords });
  }

  return (
    <Dropdown
      as={ButtonGroup}
      autoClose="outside"
      show={openDropdown === title}
      onToggle={handleTogglePress}
      drop={isVertical ? "start" : "down"}
      // onTouchStart={handleTogglePress}
    >
      <Dropdown.Toggle>{title}</Dropdown.Toggle>

      <Dropdown.Menu
        className="p-3"
        onTouchStart={event => event.stopPropagation()}
      >
        { formControls && 
          <Container className="p-0" style={{ width: formWidth }}>
            { formControls.map(({ label, units, ...info }, idx) => (
              <Row 
                key={label}
                className={idx === formControls.length - 1 ?
                  "align-items-center" : "align-items-center mb-2"
                }
              >
                <Col>{label}</Col>
                <Col>
                  <InputGroup>
                    <Form.Control
                      { ...info }
                      className="mx-auto"
                      onChange={handleControlChange}
                    />
                    { units && 
                      <InputGroup.Text>{units}</InputGroup.Text>
                    }
                  </InputGroup>
                </Col>
              </Row>
            ))}
          </Container>
        }

        { formSwitches &&
          <>
            <hr className="my-2"/>
            <Container className="p-0" style={{ width: formWidth }}>
              <Form>
                { formSwitches.map(({ label, id, isChecked }, idx) => (
                  <FormCheck
                    key={label}
                    id={id}
                    type="switch"
                    className={idx === formSwitches.length - 1 ?
                      "align-items-center" : "align-items-center mb-2"
                    }
                  >
                    <FormCheckLabel>{label}</FormCheckLabel>
                    <FormCheckInput
                      checked={isChecked}
                      onChange={handleSwitchChange}
                    />
                  </FormCheck>
                ))}
              </Form>
            </Container>
          </>
        }
      </Dropdown.Menu>
    </Dropdown>
  );

  function handleTogglePress() {
    const dropdownName = openDropdown === title ? null : title;

    universalDispatch({ type: "toggleDropdown", dropdownName });
  }

  function handleControlChange(event) {
    const id = event.target.id;
    const value = event.target.type === "number" ? parseInt(event.target.value) : event.target.value;

    universalDispatch({ type: "updateToolbarValue", id, value });
  }

  function handleSwitchChange(event) {
    const id = event.target.id;

    if (id === 'darkMode') {
      universalDispatch({ type: "toggleDarkMode" });
    } else {
      universalDispatch({ type: "toggleToolbarBoolean", id });
    }
  }
}