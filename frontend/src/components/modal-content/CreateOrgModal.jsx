import { Text, Modal, Group, TextInput, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuthContext } from "../../context/AuthContext";

import { getToken } from "../../helpers";
import { API } from "../../constant";

export const CreateOrgModal = () => {
  const { user } = useAuthContext();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    await createOrg(values);
  };

  const createOrg = async (data) => {
    // setIsLoading(true);
    // const vaultId = vault.data.documentId;

    try {
      const response = await fetch(`${API}/organisations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            name: data.name,
            // userId: user.id,
            owners: { connect: [user.documentId] },
          },
        }),
      });
      // const newVault = await response.json();
      const tData = await response.json();
      return tData;

      // await postToVault(newVault.documentId);

      // await fetchVault();
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>create org</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack>
          Modal content : create org
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Group>
              <TextInput
                withAsterisk
                label="org name"
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
              <Button color="black" fw="400" tt={"capitalize"} type="submit">
                create
              </Button>
            </Group>
          </form>
        </Stack>
      </Modal.Body>
    </>
  );
};
