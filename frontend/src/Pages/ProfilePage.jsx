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
  Divider,
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
      label: "player",
      link: "",
    },
  ];

  if (isLoading) {
    return "loading...";
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Stack gap="4rem">
        <PageTitle
          title={`${user ? user.username : ""}`}
          description={"Manage the player"}
        />
        <Divider />

        <Stack>
          <Group>
            <Image src={orgIcon} width={40} height={40} />
            <Title order={2} fw={300} tt="capitalize">
              my organisations
            </Title>
          </Group>
          <Text opacity={0.6} fw="400">
            Organisation association
          </Text>
        </Stack>

        <Grid>
          <Grid.Col span={6}>
            <Stack>
              <Text tt="capitalize">Owned Organisations</Text>

              <Stack>
                <Button
                  w="fit-content"
                  onClick={() => setCustomModalContent({ type: "createOrg" })}
                  color="black"
                  fw="400"
                  leftSection={<Image src={plusIcon} />}
                  // onClick={open}
                  tt="capitalize"
                >
                  create organisation
                </Button>

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
        <Divider />
        <Stack>
          <Group>
            <Image src={vaultIcon} width={40} height={40} />
            <Title order={2} fw={300} tt="capitalize">
              my personal vaults
            </Title>
          </Group>
          <Text opacity={0.6} fw="400">
            Management of players personal vaults.
          </Text>
        </Stack>

        <Stack>
          <Button
            color="black"
            fw="400"
            leftSection={<Image src={plusIcon} />}
            onClick={() =>
              setCustomModalContent({ type: "createPersonalVault" })
            }
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
    </>
  );
};

export default ProfilePage;
