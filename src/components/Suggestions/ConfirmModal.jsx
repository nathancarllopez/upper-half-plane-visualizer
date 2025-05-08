import { useRef, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";

import postSuggestion from "./postSuggestion";

export default function ConfirmModal({ formData, openModal, setOpenModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalTitle, setModalTitle] = useState("Confirm Suggestion");

  const typeLabels = { feature: "New Feature", bug: "Bug Report", design: "Design Improvement" };
  const listData = Object.keys(formData).reduce((accArr, key) => {
    const data = formData[key];
    
    switch(key) {
      case 'type': {
        if (data === 'other') return accArr;
        if (!Object.hasOwn(typeLabels, data)) throw new Error(`Unexpected suggestion type: ${key}, ${data}`);
        return [ ...accArr, { label: "Type", value: typeLabels[data] } ]
      }

      case 'otherType': {
        if (data === "") return accArr;
        return [ ...accArr, { label: "Type", value: data }];
      }

      case 'suggestion': {
        return [ ...accArr, { label: "Suggestion", value: data }];
      }
      
      default: {
        throw new Error(`Unexpected key: ${key}`);
      }
    }
  }, []);

  return (
    <Modal show={openModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Stack>
          { listData.map(({ label, value }) => (
            <ListGroup key={label} horizontal>
              <ListGroup.Item className="fw-bold w-25 border-0">
                { label }
              </ListGroup.Item>
              <ListGroup.Item className="w-75 border-0">
                { value }
              </ListGroup.Item>
            </ListGroup>
          )) }
        </Stack>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>

        <Button 
          onClick={handleConfirmClick}
          disabled={modalTitle === "Error with Submission"}
        >
          { isSubmitting ? <>Submitting... <Spinner size="sm"/></> : "Confirm" }
        </Button>
      </Modal.Footer>
    </Modal>
  );

  function handleCloseModal() {
    setOpenModal(false);
  }

  async function handleConfirmClick() {
    setIsSubmitting(true);

    try {
      const response = await postSuggestion(formData);
      
      if (response.ok) {
        setModalTitle("Thanks for the Feedback!");
        setTimeout(() => setOpenModal(false), MODAL_COOLDOWN);
      } else {
        setModalTitle("Error with Submission");
      }

      setIsSubmitting(false);
    }
    
    catch(error) {
      throw new Error(`Posting suggestion failed: ${error}`);
    }
  }
}

const MODAL_COOLDOWN = 1500;