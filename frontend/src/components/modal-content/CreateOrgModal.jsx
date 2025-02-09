import { Modal, Group, TextInput, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import { useSiteStore } from "@/Store";
import { useAuthContext } from "@/context/AuthContext";

import { getToken } from "@/helpers";
import { API } from "@/constant";

export const CreateOrgModal = () => {
  const navigate = useNavigate();
  const { setIsLoading, customModal, setSelectedOrg } = useSiteStore();
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
    navigate(`/organisation`, { replace: true });
    customModal.close();
  };

  const createOrg = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            name: data.name,
            owners: { connect: [user.documentId] },
          },
        }),
      });

      const tData = await response.json();
      setSelectedOrg(tData.data);
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
