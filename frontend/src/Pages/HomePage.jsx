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
  Alert,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";

import { API } from "@/constant";
import { useSiteStore } from "@/Store";
import { useAuthContext } from "@/context/AuthContext";

import filterIcon from "@/assets/icons/filter_list_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import searchIcon from "@/assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import bugIcon from "@/assets/icons/bug_report_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import componentIcon from "@/assets/icons/bottom_app_bar_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import armorIcon from "@/assets/icons/local_police_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import bentoIcon from "@/assets/icons/bento_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import accountTreeIcon from "@/assets/icons/account_tree_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import usbIcon from "@/assets/icons/usb_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

// TODO: get from db
const ITEM_TYPES = {
  general: { icon: bentoIcon },
  ship_component: { icon: componentIcon },
  ship_weapon: { icon: accountTreeIcon },
  fps_weapon: { icon: usbIcon },
  fps_armor: { icon: armorIcon },
};

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

      console.log(data.data)
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
        <Stack gap={"xs"}>
          <PageTitle
            title={"market"}
            description={"Search the market"}
            icon={<Avatar size="xl" radius={0} />}
          />
          <Alert
            variant="light"
            color="red"
            title="Imp"
            icon={<Image src={bugIcon} w={20} h={20} />}
          >
            Nothing to see here, move along.
          </Alert>
        </Stack>
        <Divider />
        <Stack gap={"xs"}>
          <Group>
            <Image src={bugIcon} width={40} height={40} />
            <Title order={2} fw={300} tt="capitalize">
              Trading Organisations
            </Title>
          </Group>

          <Group gap={"xs"}>
            {organisations && organisations.length
              ? organisations.map((org) => (
                  <Group gap={0} key={org.documentId}>
                    <Avatar size="sm" />
                    <Text tt="capitalize" size="xs">
                      {org.name},
                    </Text>
                  </Group>
                ))
              : null}
          </Group>
        </Stack>

        <Divider />
        <Stack gap={"xs"}>
          <Group>
            <Image src={bugIcon} width={40} height={40} />
            <Title order={2} fw={300} tt="capitalize">
              Market board
            </Title>
          </Group>
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
                          <Stack gap={0}>
                            <Group gap="xs">
                              {item.item && item.item.type ? (
                                <Avatar
                                  src={ITEM_TYPES[item.item.type].icon}
                                  size="sm"
                                />
                              ) : null}

                              <Stack gap={0}>
                                <Group>
                                  <Text size="sm" fw={500}>
                                    {item.item.name}
                                  </Text>
                                  <Text size="xs" opacity={0.5}>
                                    {item.item.type}
                                  </Text>
                                </Group>

                                <Group>
                                  {item.item.category ? (
                                    <Text size="xs" ta="center" tt="uppercase">
                                      {item.item.category
                                        ? item.item.category
                                        : " "}
                                    </Text>
                                  ) : null}
                                  {item.item.size ? (
                                    <Text size="xs" ta="center">
                                      {item.item.size ? item.item.size : " "}
                                    </Text>
                                  ) : null}
                                  {item.item.grade ? (
                                    <Text size="xs" ta="center" tt="uppercase">
                                      {item.item.grade ? item.item.grade : " "}
                                    </Text>
                                  ) : null}

                                  {item.item.class ? (
                                    <Text size="xs" ta="center" tt="uppercase">
                                      {item.item.class ? item.item.class : " "}
                                    </Text>
                                  ) : null}
                                </Group>
                              </Stack>
                            </Group>
                          </Stack>
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
      </Stack>
    </>
  );
}

export default HomePage;
