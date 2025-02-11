import { useState, useEffect } from "react";

import {
  Group,
  Text,
  Button,
  TextInput,
  Image,
  Modal,
  Grid,
  Stack,
  Alert,
  Badge,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useParams } from "react-router";

import VaultTable from "@/components/VaultTable";
import Vault from "@/components/Vault";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { PostToVaultForm } from "@/components/forms/PostToVaultForm";

import { useAuthContext } from "../context/AuthContext";
import { useSiteStore } from "@/Store";
import { API } from "@/constant";
import { getToken } from "@/helpers";

import plusIcon from "@/assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import filterIcon from "@/assets/icons/filter_list_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import searchIcon from "@/assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import publicIcon from "@/assets/icons/visibility_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";

const VaultPage = ({ isOrgVault }) => {
  const { id } = useParams();
  const { selectedOrg, setIsLoading } = useSiteStore();
  const { user } = useAuthContext();
  const [vault, setVault] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const checkOwnership = async () => {
    // TODO: check ownership at the db level
    if (selectedOrg) {
      const isOwner = selectedOrg.owners.filter(
        (owner) => owner.documentId === user.documentId
      );

      if (isOwner.length) {
        return setUserIsOwner(true);
      }
      setUserIsOwner(false);
    }

    /* try {
      const response = await fetch(
        `${API}/organisations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setOrgNotifications(data.data ? data.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    } */
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      search: "",
      termsOfService: false,
    },

    /* validate: {
      search: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    }, */
  });

  const columns = ["label", "quantity", "note", "delete"];

  const breadcrumbs = [
    {
      label:
        isOrgVault && selectedOrg
          ? selectedOrg.name
          : user
          ? user.username
          : "",
      link: "",
    },
    {
      label: vault ? vault.data.name : "vault",
      link: "",
    },
  ];

  const fetchVault = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/vaults/${id}?populate[0]=Items&populate[1]=Items.item`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();

      setVault(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const transform = (data) =>
    data.map((item) => {
      return {
        label: item.item ? item.item.name : "",
        quantity: item.quantity,
        note: item.note,
        delete: true,
        item: item,
      };
    });

  const postToVault = async (values) => {
    // TODO: currently theres no way to add a new element to strapis repeat components, the whole table needs to be replaced
    // find a better way?
    setIsLoading(true);
    const vaultId = vault.data.documentId;

    const updatedItems = vault.data.Items.map((item) => {
      if (item.item.documentId === values.item.documentId) {
        return {
          item: item.item.documentId,
          quantity: item.quantity + values.quantity,
        };
      }
      return {
        item: item.item.documentId,
        quantity: item.quantity,
      };
    });

    let addItem = true;
    updatedItems.forEach((item) => {
      if (item.item === values.item.documentId) {
        addItem = false;
      }
    });

    if (addItem) {
      updatedItems.push({
        item: values.item.documentId,
        quantity: values.quantity,
      });
    }

    try {
      const response = await fetch(`${API}/vaults/${vaultId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            Items: updatedItems,
          },
        }),
      });
      await response.json();
      await fetchVault();
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      close();
      setIsLoading(false);
    }
  };

  const deleteFromVault = async (values) => {
    // TODO: currently theres no way to add a new element to strapis repeat components, the whole table needs to be replaced
    // find a better way?
    setIsLoading(true);
    const vaultId = vault.data.documentId;

    const filteredItems = vault.data.Items.filter((item) => item.id !== values);

    const transformedItems = filteredItems.map((item) => {
      return {
        item: item.item.documentId,
        quantity: item.quantity,
      };
    });

    try {
      const response = await fetch(`${API}/vaults/${vaultId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            Items: transformedItems,
          },
        }),
      });
      await response.json();
      await fetchVault();
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      close();
      setIsLoading(false);
    }
  };

  const updateItemInVault = async (values) => {
    // TODO: currently theres no way to add a new element to strapis repeat components, the whole table needs to be replaced
    // find a better way?
    console.log("imp: updateItemInVault");
    console.log(values.itemId);

    setIsLoading(true);

    const vaultId = vault.data.documentId;

    const filteredItems = vault.data.Items.map((item) => {
      if (item.id === values.itemId) {
        item.note = values.note;
      }
      return item;
    });

    const transformedItems = filteredItems.map((item) => {
      return {
        item: item.item.documentId,
        quantity: item.quantity,
        note: item.note,
      };
    });

    try {
      const response = await fetch(`${API}/vaults/${vaultId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            Items: transformedItems,
          },
        }),
      });
      await response.json();
      await fetchVault();
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      close();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [id]);

  useEffect(() => {
    if (selectedOrg) {
      checkOwnership();
    }
  }, [selectedOrg]);

  return vault ? (
    <>
      <Modal opened={opened} onClose={close} title="Add Item to Vault">
        <PostToVaultForm post={postToVault} />
      </Modal>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Stack gap="4rem">
        <Grid align="center">
          <Grid.Col span={6}>
            <PageTitle
              title={`${vault.data.name}`}
              description={"Manage the vault."}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            {userIsOwner ? (
              <Alert
                variant="light"
                color={vault.data.marketable ? "red" : "blue"}
                icon={
                  vault.data.marketable ? (
                    <Badge color="red" p={0}>
                      <Image
                        src={publicIcon}
                        width={"20rem"}
                        height={"20rem"}
                      />
                    </Badge>
                  ) : null
                }
                title={
                  vault.data.marketable ? (
                    <Text>Vault is public and listed on the market.</Text>
                  ) : (
                    <Text>Vault is private</Text>
                  )
                }
              >
                <Stack gap={0}>
                  <Text fw="400">
                    {vault.data.marketable
                      ? "Remove vault from the market?"
                      : "Sell vault contents on the market?"}
                  </Text>
                  <Button
                    fw={400}
                    w="fit-content"
                    color={vault.data.marketable ? "red" : "blue"}
                    onClick={() => console.log("clicked")}
                  >
                    {vault.data.marketable
                      ? "Yes, remove my vault from the Market!"
                      : "Yes, put my vault on the Market!"}
                  </Button>
                </Stack>
              </Alert>
            ) : null}
          </Grid.Col>
        </Grid>

        <Divider />

        <Vault>
          <Group justify="space-between">
            <Text fw="500" tt="capitalize">
              All Items{" "}
              <span style={{ opacity: 0.6 }}>{vault.data.Items.length}</span>
            </Text>
            <Group>
              <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Group justify="space-between">
                  <Group>
                    <TextInput
                      leftSectionPointerEvents="none"
                      leftSection={<Image src={searchIcon} />}
                      placeholder="Search"
                      key={form.key("search")}
                      {...form.getInputProps("search")}
                    />
                    <Button
                      variant="outline"
                      color="black"
                      fw="400"
                      /* type="submit" */
                      leftSection={<Image src={filterIcon} />}
                    >
                      Filter
                    </Button>
                  </Group>
                </Group>
              </form>
              {userIsOwner ? (
                <Button
                  color="black"
                  fw="400"
                  leftSection={<Image src={plusIcon} />}
                  onClick={open}
                >
                  Add Item
                </Button>
              ) : null}
            </Group>
          </Group>

          {vault.data.Items.length ? (
            <VaultTable
              canEdit={userIsOwner}
              saveItem={updateItemInVault}
              columns={columns}
              elements={transform(vault.data.Items)}
              deleteItem={deleteFromVault}
            />
          ) : null}
        </Vault>
      </Stack>
    </>
  ) : null;
};

export default VaultPage;
