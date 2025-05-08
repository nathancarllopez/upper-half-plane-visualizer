import { useContext, useState } from "react";

import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Fab from "../FloatingActionButton/Fab";
import DropdownMenu from "./DropdownMenu";
import HistoryButtons from "./HistoryButtons";
import DropdownForm from "./DropdownForm";
import AxesResetButton from "./AxesResetButton";
import { UniversalStateContext } from "../../contexts/UniversalStateProvider";

export default function Toolbar() {
  const { toolbar } = useContext(UniversalStateContext);
  const { isVertical } = toolbar;
  const [isExpanded, setIsExpanded] = useState(true);

  const containerStyle = {
    position: "fixed",
    zIndex: "10",
    top: 0,
    right: 0,
    margin: "1rem"
  }

  return (
    <>
    { isExpanded ?
      <Card style={containerStyle}>
        <Fab fabName="Collapse" onFabPress={() => setIsExpanded(false)}/>
        <Card.Body>
          <ButtonGroup vertical={isVertical}>
            <AxesResetButton/>
            <DropdownMenu title="Drawings"/>
            <DropdownMenu title="Animations"/>
            <DropdownForm title="Styles"/>
            <HistoryButtons/>
            <DropdownForm title="Settings"/>
          </ButtonGroup>
        </Card.Body>
      </Card> :
      <Fab fabName="Toolbar" onFabPress={() => setIsExpanded(true)}/>
    }
    </>
  );
}