import { Text } from "@mantine/core";
import { Modal } from "@mantine/core";

export const DefaultModal = () => {
  return (
    <>
      <Modal.Header>
        <Modal.Title>default title</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>Modal content : default</Modal.Body>
    </>
  );
};
