import { useState } from "react";

import {
  Text,
  Group,
  Button,
  Stack,
  Title,
  Grid,
  Image,
  UnstyledButton,
} from "@mantine/core";
import { useNavigate } from "react-router";

import { useAuthContext } from "../context/AuthContext";
import { PageTitle } from "../components/PageTitle";
import { Breadcrumbs } from "../components/Breadcrumbs";

import { API } from "../constant";
import { getToken } from "../helpers";
import { useSiteStore } from "../Store";

import plusIcon from "../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import vaultIcon from "../assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import orgIcon from "../assets/icons/build_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import notificationIcon from "../assets/icons/notifications_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import { VaultCard } from "../components/VaultCard";
import { OrgCard } from "../components/OrgCard";

const ProfilePage = () => {
  const {
    userVaults,
    customModal,
    setCustomModalContent,
    memberOrgs,
    ownerOrgs,
  } = useSiteStore();
  const [loading, setLoading] = useState(false);
  const { user, isLoading, setUser } = useAuthContext();

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const breadcrumbs = [
    {
      label: "settings",
      link: "",
    },
    {
      label: "profile",
      link: "",
    },
  ];

  if (isLoading) {
    return "loading...";
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <PageTitle title={`profile`} description={"words, things and stuff"} />
      <Stack gap="xl">
        
        <Stack gap="xs">
          <Group gap={"xl"}>
            <Group>
              <Image src={orgIcon} />
              <Title order={2} fw={400} tt="capitalize">
                my organisations
              </Title>
            </Group>
          </Group>
          <Grid>
            <Grid.Col span={6}>
              <Stack>
                <Text tt="capitalize">Owned Organisations</Text>
                <Group>
                  <Button
                    onClick={() => setCustomModalContent("createOrg")}
                    color="black"
                    fw="400"
                    leftSection={<Image src={plusIcon} />}
                    // onClick={open}
                    tt="capitalize"
                  >
                    create organisation
                  </Button>
                </Group>
                <Stack gap={0}>
                  {ownerOrgs && ownerOrgs.length ? (
                    ownerOrgs.map((org) => <OrgCard organisation={org} />)
                  ) : (
                    <Text opacity={0.5}>No owned organisations</Text>
                  )}
                </Stack>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack>
                <Text tt="capitalize">member Organisations</Text>
                <Stack gap={0}>
                  {memberOrgs && memberOrgs.length ? (
                    memberOrgs.map((org) => <OrgCard organisation={org} />)
                  ) : (
                    <Text opacity={0.5}>No organisations</Text>
                  )}
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
        <Stack gap="xs">
          <Group gap={"xl"}>
            <Group>
              <Image src={vaultIcon} />
              <Title order={2} fw={400} tt="capitalize">
                my personal vaults
              </Title>
            </Group>
          </Group>
          <Stack>
            <Button
              color="black"
              fw="400"
              leftSection={<Image src={plusIcon} />}
              onClick={() => setCustomModalContent("createPersonalVault")}
              tt="capitalize"
              w={"fit-content"}
            >
              create vault
            </Button>

            {userVaults && userVaults.length ? (
              <Stack gap={0}>
                {userVaults.map((vault) => (
                  <VaultCard
                    key={vault.documentId}
                    vault={vault}
                    isPersonalVault
                  />
                ))}
              </Stack>
            ) : (
              <Text opacity={0.5}>No personal vaults</Text>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default ProfilePage;
