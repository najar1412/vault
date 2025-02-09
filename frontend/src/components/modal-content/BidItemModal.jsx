import { Button, Stack, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useSiteStore } from "@/Store";
import { getToken } from "@/helpers";
import { API } from "@/constant";

export const BidItemModal = () => {
  const { customModal, setIsLoading } = useSiteStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {},

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const fetchConfirmDeal = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/notifications/confirm-deal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            type: "confirm-deal",
            requiresConfirmation: false,
            confirmationConfirmed: null,
            senderRelation: "user",
            senderId: data.senderId,
            receiverRelation: "vault",
            receiverId: data.vaultId,
            quantity: String(data.quantity),
            reward: String(data.reward),
            itemId: data.itemId,
          },
        }),
      });
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    await fetchConfirmDeal(data);
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title>confirm bid</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack>
          Modal content : confirm bid
          <Text>Item</Text>
          <Stack gap={0}>
            <Text fw="500">vaultId</Text>
            <Text>{customModal.data.vaultId}</Text>
            <Text fw="500">itemId</Text>
            <Text>{customModal.data.itemId}</Text>
            <Text fw="500">quantity</Text>
            <Text>IMP</Text>
            <Text fw="500">cost</Text>
            <Text>IMP</Text>
          </Stack>
          <form
            onSubmit={form.onSubmit(() =>
              handleSubmit(
                customModal
                  ? customModal.data
                    ? customModal.data
                    : null
                  : null
              )
            )}
          >
            <Button color="black" fw="500" tt={"capitalize"} type="submit">
              confirm
            </Button>
          </form>
        </Stack>
      </Modal.Body>
    </>
  );
};
