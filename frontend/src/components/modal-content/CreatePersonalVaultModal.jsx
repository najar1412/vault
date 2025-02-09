import { useNavigate } from "react-router";
import { Button, Stack, Group, TextInput, Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuthContext } from "@/context/AuthContext";
import { getToken } from "@/helpers";
import { API } from "@/constant";
import { useSiteStore } from "@/Store";

export const CreatePersonalVaultModal = () => {
  const navigate = useNavigate();
  const { customModal, setIsLoading } = useSiteStore();
  const { user, setUser } = useAuthContext();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      vaultName: "",
    },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const createVault = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API}/vaults/createVault`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            name: data.name,
            userId: user.id,
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
    const data = {
      documentId: user.documentId,
      name: values.vaultName,
      vaults: {
        connect: {},
        name: values.vaultName,
      },
    };

    const newVault = await createVault(data);
    setUser(newVault.user);
    customModal.close();
    navigate(`/vault/${newVault.newVault.documentId}`);
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>create personal vault</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack>
          <Text>Modal content : create personal vault</Text>

          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Group>
              <TextInput
                withAsterisk
                label="vault name"
                key={form.key("vaultName")}
                {...form.getInputProps("vaultName")}
              />
              <Button color="black" fw="400" tt={"capitalize"} type="submit">
                create
              </Button>
            </Group>
          </form>
          <Text>{user ? user.documentId : ""}</Text>
        </Stack>
      </Modal.Body>
    </>
  );
};
