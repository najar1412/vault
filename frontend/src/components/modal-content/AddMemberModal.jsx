import { Button, Stack, Group, TextInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";

import { API } from "../../constant";
import { getToken } from "../../helpers";
import { useSiteStore } from "../../Store";

export const AddMemberModal = () => {
  const navigate = useNavigate();
  const { selectedOrg, setIsLoading, customModal } = useSiteStore();

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
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/notifications/invite-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    await fetchSendMemberInvite(values);
    customModal.close();
    navigate("/organisation", { replace: true });
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
