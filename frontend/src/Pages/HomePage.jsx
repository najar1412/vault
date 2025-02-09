import { useEffect, useState } from "react";

import {
  Text,
  Group,
  Button,
  TextInput,
  Stack,
  Divider,
  Avatar,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";

import { API } from "../constant";
import { useSiteStore } from "../Store";
import { useAuthContext } from "../context/AuthContext";

import filterIcon from "../assets/icons/filter_list_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import searchIcon from "../assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

function HomePage() {
  const [organisations, setOrganisations] = useState(false);
  const [vaults, setVaults] = useState(false);
  const { setCustomModalContent, setIsLoading } = useSiteStore();
  const { user } = useAuthContext();

  const breadcrumbs = [
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
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations`);
      const data = await response.json();

      setOrganisations(data.data ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketableVaults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/vaults?filters[marketable][$eq]=true&populate[0]=Items&populate[1]=Items.item`
      );
      const data = await response.json();

      setVaults(data.data ? data.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemBid = async (data) => {
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
                        {user ? (
                          <Button
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
                          </Button>
                        ) : (
                          <Text opacity={0.5}>Join to buy items</Text>
                        )}
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
