import { useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ConfirmModal from "./ConfirmModal";

export default function SuggestionForm() {
  const [formData, setFormData] = useState(() => getFormData(""));
  const [invalidInputs, setInvalidInputs] = useState(() => getFormData(false));
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <h5 className="text-center">Suggestion Form</h5>
      
      <Form className="mb-3">
        <Row className={invalidInputs.type ? undefined : "mb-3"}>
          <Form.Group as={Col} controlId="suggestion-type">
            <Form.Label>Type</Form.Label>
            <Form.Select
              onChange={handleChange}
              name="type"
              value={formData.type}
            >
              <option value={""}> -- </option>
              <option value={"feature"}>New feature</option>
              <option value={"bug"}>Bug report</option>
              <option value={"design"}>Design Improvement</option>
              <option value={"other"}>Other</option>
            </Form.Select>
            { invalidInputs.type &&
              <Form.Text className="text-danger">Please choose a suggestion type.</Form.Text>
            }
          </Form.Group>
        </Row>

        { formData.type === 'other' &&
          <Row className="mb-3">
            <Form.Group as={Col} controlId="suggestion-other-type">
              <Form.Label>Other Type</Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                name="otherType"
                value={formData.otherType}
              />
              { invalidInputs.otherType &&
                <Form.Text className="text-danger">Please give a category for your suggestion.</Form.Text>
              }
            </Form.Group>
          </Row>
        }

        <Row>
          <Form.Group as={Col} controlId="suggestion-text">
            <Form.Label>Suggestion</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={3}
              onChange={handleChange}
              name="suggestion"
              className="mb-3"
            />
            { invalidInputs.suggestion &&
              <Form.Text className="text-danger">Please describe your suggestion.</Form.Text>
            }
          </Form.Group>
        </Row>
        
        <Row className="text-center">
          <Col>
            <Button onClick={handleClick}>Submit</Button>
          </Col>
        </Row>
      </Form>

      { openModal && 
        <ConfirmModal formData={formData} openModal={openModal} setOpenModal={setOpenModal}/> 
      }
    </div>
  );

  function handleChange(event) {
    const inputEl = event.nativeEvent.target;
    const { name, value } = inputEl;

    setFormData(prev => {
      if (name === 'type' && value !== 'other') {
        return {
          ...prev,
          otherType: "",
          type: value
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  }

  function handleClick() {
    const isValid = validateFormData();
    if (isValid) setOpenModal(true);
  }

  function validateFormData() {
    const badInputs = [];

    const { type, otherType } = formData;
    if (!type) {
      badInputs.push(['type', true]);
    } else if (type === 'other' && !otherType) {
      badInputs.push(['otherType', true]);
    }

    const { suggestion } = formData;
    if (!suggestion) {
      badInputs.push(['suggestion', true]);
    }

    if (badInputs.length > 0) {
      setInvalidInputs(prev => {
        setTimeout(() => {
          setInvalidInputs(() => getFormData(false));
        }, ERROR_MESSAGE_DURATION);

        const next = Object.fromEntries(badInputs);
        return { ...prev, ...next };
      });

      return false;
    }

    return true;
  }
}

const ERROR_MESSAGE_DURATION = 3000;  // ms

function getFormData(value) {
  return { type: value, otherType: value, suggestion: value };
}