// import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

import { useSiteStore } from "../Store";

import { DefaultModal } from "./modal-content/DefaultModal";
import { CreateOrgModal } from "./modal-content/CreateOrgModal";
import { CreatePersonalVaultModal } from "./modal-content/CreatePersonalVaultModal";
import { AddMemberModal } from "./modal-content/AddMemberModal";
import { AddOwnerModal } from "./modal-content/AddOwnerModal";
import { CreateOrgVaultModal } from "./modal-content/CreateOrgVaultModal";

const MODALCONTENT = {
  default: <DefaultModal />,
  createOrg: <CreateOrgModal />,
  createPersonalVault: <CreatePersonalVaultModal />,
  createOrgVault: <CreateOrgVaultModal />,
  addOwner: <AddOwnerModal />,
  addMember: <AddMemberModal />,
};

export const CustomModal = ({ opened, close }) => {
  const { customModal } = useSiteStore();

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          {customModal
            ? MODALCONTENT[
                customModal.content ? customModal.content : "default"
              ]
            : MODALCONTENT.default}
        </Modal.Content>
      </Modal.Root>

      {/* <Button variant="default" onClick={open}>
        Open modal
      </Button> */}
    </>
  );
};
