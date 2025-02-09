import { Modal } from "@mantine/core";

import { useSiteStore } from "@/Store";

import { DefaultModal } from "./modal-content/DefaultModal";
import { CreateOrgModal } from "./modal-content/CreateOrgModal";
import { CreatePersonalVaultModal } from "./modal-content/CreatePersonalVaultModal";
import { AddMemberModal } from "./modal-content/AddMemberModal";
import { AddOwnerModal } from "./modal-content/AddOwnerModal";
import { CreateOrgVaultModal } from "./modal-content/CreateOrgVaultModal";
import { BidItemModal } from "./modal-content/BidItemModal";

const MODALCONTENT = {
  default: () => <DefaultModal />,
  createOrg: () => <CreateOrgModal />,
  createPersonalVault: () => <CreatePersonalVaultModal />,
  createOrgVault: () => <CreateOrgVaultModal />,
  addOwner: () => <AddOwnerModal />,
  addMember: () => <AddMemberModal />,
  bidItem: (data) => <BidItemModal data={data} />,
};

const ModalSelector = (template, data) => {
  return MODALCONTENT[template.template](data);
};

export const CustomModal = ({ opened, close }) => {
  const { customModal } = useSiteStore();

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          {customModal ? (
            customModal.template ? (
              <ModalSelector
                template={customModal.template}
                data={customModal.data}
              />
            ) : (
              "default"
            )
          ) : (
            MODALCONTENT.default
          )}
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
