import {
  Container,
  Text,
  Group,
  Button,
  TextInput,
  Stack,
  Divider,
  Avatar,
  Image,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { API } from "../constant";
import { useForm } from "@mantine/form";
import { useSiteStore } from "../Store";
import plusIcon from "../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import filterIcon from "../assets/icons/filter_list_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import searchIcon from "../assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import publicIcon from "../assets/icons/visibility_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";

import { useAuthContext } from "../context/AuthContext";

function HomePage() {
  const [organisations, setOrganisations] = useState(false);
  const [vaults, setVaults] = useState(false);
  const { setCustomModalContent, customModal } = useSiteStore();
  const { user } = useAuthContext();

  const breadcrumbs = [
    {
      label: "player",
      link: "",
    },
    {
      label: "market",
      link: "",
    },
  ];

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      search: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const getOrgs = async () => {
    // setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations`
        /* {
            headers: {
              "Content-Type": "application/json",
              // set the auth token to the user's jwt
              Authorization: `Bearer ${getToken()}`,
            },
          } */
      );
      const data = await response.json();
      setOrganisations(data.data ? data.data : []);
      // setOwnerOrgs(data.data.length ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchMarketableVaults = async () => {
    // setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/vaults?filters[marketable][$eq]=true&populate[0]=Items&populate[1]=Items.item`
        /* {
            headers: {
              "Content-Type": "application/json",
              // set the auth token to the user's jwt
              Authorization: `Bearer ${getToken()}`,
            },
          } */
      );
      const data = await response.json();
      console.log(data);
      setVaults(data.data ? data.data : []);
      // setOwnerOrgs(data.data.length ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleItemBid = async (data) => {
    console.log("collect");
    console.log(data);
    setCustomModalContent({ type: "bidItem", data: data });
  };

  useEffect(() => {
    getOrgs();
    fetchMarketableVaults();
  }, []);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Stack gap="4rem">
        <PageTitle
          title={"market"}
          description={"Search the market"}
          icon={<Avatar size="xl" radius={0} />}
        />
        <Divider />
        <Group justify="space-between">
          <Text fw="500" tt="capitalize">
            All Items <span style={{ opacity: 0.6 }}>0</span>
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
            <Button
              color="black"
              fw="400"
              leftSection={<Image src={plusIcon} />}
              onClick={open}
            >
              Add Item
            </Button>
          </Group>
        </Group>

        <Stack>
          {vaults
            ? vaults.map((vault) =>
                vault.Items
                  ? vault.Items.map((item) => (
                      <Group key={item.documentId}>
                        <Text>{item.item.name}</Text>
                        <Text>x{item.quantity}</Text>
                        {
                          user ? <Button
                          color="black"
                          fw="500"
                          onClick={(e) =>
                            handleItemBid({
                              vaultId: vault.documentId,
                              itemId: item.item.documentId,
                              senderId: user.documentId,
                              quantity: 0,
                              reward: 0,
                            })
                          }
                        >
                          bid
                        </Button> : <Text opacity={0.5}>Join to buy items</Text>
                        }
                      </Group>
                    ))
                  : null
              )
            : null}
        </Stack>
      </Stack>
    </>
  );
}

export default HomePage;
