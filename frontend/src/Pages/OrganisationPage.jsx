import { useState, useEffect } from "react";

import {
  Grid,
  Text,
  Stack,
  Avatar,
  Group,
  Title,
  Image,
  Alert,
  Button,
  Box,
} from "@mantine/core";
import { Link, useNavigate } from "react-router";

import { useSiteStore } from "../Store";
import { API } from "../constant";
import { getToken } from "../helpers";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { VaultCard } from "../components/VaultCard";

import vaultIcon from "../assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import membersIcon from "../assets/icons/group_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import plusIcon from "../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import editIcon from "../assets/icons/edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import notificationIcon from "../assets/icons/notifications_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

import { OrgOwnerCard } from "../components/OrgOwnerCard";
import { OrgMemberCard } from "../components/OrgMemberCard";

const OrganisationPage = () => {
  const { selectedOrg, setCustomModalContent, notifications } = useSiteStore();
  const [orgNotifications, setOrgNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(false);
  const [owners, setOwners] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const breadcrumbs = [
    {
      label: selectedOrg ? selectedOrg.name : "",
      link: "",
    },
    {
      label: "organisation",
      link: "",
    },
  ];

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations/${selectedOrg.documentId}?populate=owners&populate=members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setOwners(data.data.owners.length ? data.data.owners : false);
      setMembers(data.data.members.length ? data.data.members : false);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrgNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/notifications?filters[senderId][$eq]=${selectedOrg.documentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setOrgNotifications(data.data ? data.data : []);
      // setOwnerOrgs(data.data.length ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgNotifications();
  }, [selectedOrg]);

  if (isLoading) {
    return "loading...";
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <PageTitle
        title={`${selectedOrg ? selectedOrg.name : ""}`}
        description={"Manage the organisation"}
      />
      <Group>
        <Image src={notificationIcon} />
        <Title order={2} fw={400} tt="capitalize">
          Notifications
        </Title>
      </Group>
      {orgNotifications.length ? (
        <Grid>
          <Grid.Col span={6}>
            <Stack>
              <Text>recieved</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack>
              <Text>Sent</Text>
              {orgNotifications.map((notif) => (
                <Alert
                  withCloseButton
                  key={notif.documentId}
                  variant="light"
                  color={notif.resolved ? "gray" : "blue"}
                  title={notif.type}
                  icon={membersIcon.src}
                >
                  {notif.resolved ? null : (
                    <Group>
                      <Text>{notif.type}</Text>
                      <Button>accept</Button>
                      <Button>reject</Button>
                    </Group>
                  )}

                  <Group>
                    <Text size="xs" opacity={0.5}>
                      {notif.senderId} {">"} {notif.receiverId}
                    </Text>
                  </Group>
                </Alert>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>
      ) : (
        <Text opacity={0.5}>No notifications</Text>
      )}

      <Group>
        <Image src={membersIcon} />
        <Title order={2} fw={400} tt="capitalize">
          members
        </Title>
      </Group>

      <Grid>
        <Grid.Col span={6}>
          <Stack>
            <Text fw="500" tt="capitalize">
              owners
            </Text>
            <Button
              color="black"
              fw="400"
              leftSection={<Image src={plusIcon} />}
              onClick={() => setCustomModalContent("addOwner")}
              w="fit-content"
            >
              Add Owner
            </Button>
            {selectedOrg && selectedOrg.owners ? (
              <Stack gap={0}>
                {selectedOrg.owners.map((owner) => (
                  <OrgOwnerCard key={owner.username} owner={owner} />
                ))}
              </Stack>
            ) : (
              <Text opacity={0.8}>No Owners</Text>
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            <Text fw="500" tt="capitalize">
              members
            </Text>
            <Button
              color="black"
              fw="400"
              leftSection={<Image src={plusIcon} />}
              onClick={() => setCustomModalContent("addMember")}
              w="fit-content"
            >
              Add Members
            </Button>
            <Stack gap={0}>
              {selectedOrg && selectedOrg.members ? (
                <Stack gap={0}>
                  {selectedOrg.members.map((member) => (
                    <OrgMemberCard key={member.username} member={member} />
                  ))}
                </Stack>
              ) : (
                <Text opacity={0.8}>No Members</Text>
              )}
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
      <Stack>
        <Group>
          <Image src={vaultIcon} />
          <Title order={2} fw={400} tt="capitalize">
            Org Vaults
          </Title>
        </Group>
        <Button
          onClick={() => setCustomModalContent("createOrgVault")}
          color="black"
          fw="400"
          leftSection={<Image src={plusIcon} />}
          w="fit-content"
        >
          Add Vault
        </Button>
        {selectedOrg && selectedOrg.vaults ? (
          <Stack gap={0}>
            {selectedOrg.vaults.map((vault) => (
              <VaultCard key={vault.documentId} vault={vault} />
            ))}
          </Stack>
        ) : (
          <Text>no vaults</Text>
        )}
      </Stack>
    </>
  );
};

export default OrganisationPage;
