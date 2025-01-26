import { useState } from "react";

import { Button, Stack, Group, TextInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";

import { API } from "../../constant";
import { getToken } from "../../helpers";
import { useSiteStore } from "../../Store";

export const AddMemberModal = (onSuccessHandler) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedOrg } = useSiteStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
    },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const fetchSendMemberInvite = async (values) => {
    try {
      const response = await fetch(`${API}/notifications/invite-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            type: "add-to-org-member",
            requiresConfirmation: true,
            senderRelation: "organisation",
            senderId: selectedOrg.documentId,
            receiverRelation: "user",
            receiverUsername: values.username,
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

  const handleSubmit = async (values) => {
    const memberInvite = await fetchSendMemberInvite(values);
    onSuccessHandler(memberInvite);
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title>add member</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack>
          Modal content : add member
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Group>
              <TextInput
                withAsterisk
                placeholder="username"
                key={form.key("username")}
                {...form.getInputProps("username")}
              />
              <Button
                color="black"
                fw="500"
                tt={"capitalize"}
                type="submit"
                onClick={() => handleSubmit()}
              >
                send invite
              </Button>
            </Group>
          </form>
        </Stack>
      </Modal.Body>
    </>
  );
};
