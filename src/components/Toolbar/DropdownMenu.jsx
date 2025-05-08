import { useContext } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { UniversalStateContext, UniversalStateDispatchContext } from "../../contexts/UniversalStateProvider";

import './DropdownMenu.css';

export default function DropdownMenu({ title }) {
  const universalDispatch = useContext(UniversalStateDispatchContext);
  const { toolbar } = useContext(UniversalStateContext);

  const { openDropdown, clickTool, isVertical } = toolbar;

  const buttonInfo = ALL_BUTTON_INFO[title];
  const selectedButton = buttonInfo.find(info => info.name === clickTool);
  const toggleVariant = selectedButton !== undefined ? "success" : "secondary";
  const toggleTitle = selectedButton !== undefined ? selectedButton.label : title;

  return (
    <Dropdown
      as={ButtonGroup}
      show={openDropdown === title}
      onToggle={handleDropdownPress}
      drop={isVertical ? 'start' : 'down'}
      // onTouchStart={handleDropdownPress}
    >
      <Dropdown.Toggle variant={toggleVariant}>
        { toggleTitle }
      </Dropdown.Toggle>

      <Dropdown.Menu>
        { buttonInfo.map(({ name, label }) => (
          <Dropdown.Item
            key={name}
            active={clickTool === name}
            onClick={() => handleItemPress(name)}
            // onTouchStart={() => handleItemPress(name)}
          >
            { label }
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  function handleDropdownPress() {
    const dropdownName = openDropdown === title ? null : title;
    universalDispatch({ type: "toggleDropdown", dropdownName });
  }

  function handleItemPress(itemName) {
    universalDispatch({ type: "updateToolbarValue", id: "clickTool", value: itemName });
    universalDispatch({ type: "addActiveToast", toastName: itemName });
  }
}

const ALL_BUTTON_INFO = {
  "Drawings": [
    { name: 'point', label: "Point" },
    { name: 'geodesic', label: "Line" },
    { name: 'segment', label: "Line Segment" },
    { name: 'polygon', label: "Polygon" },
    { name: 'circle', label: "Circle" },
    { name: 'horocycle', label: "Horocycle" },
  ],
  "Animations": [
    { name: 'rotation', label: "Rotation" },
    { name: 'translation', label: "Translation" },
    // { name: 'customMobius', label: "Custom" }
  ]
}