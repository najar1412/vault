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
  Tabs,
  Divider,
} from "@mantine/core";

import { useSiteStore } from "@/Store";
import { useAuthContext } from "@/context/AuthContext";
import { API } from "@/constant";
import { getToken } from "@/helpers";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTitle } from "@/components/PageTitle";
import { VaultCard } from "@/components/VaultCard";

import vaultIcon from "@/assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import membersIcon from "@/assets/icons/group_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import plusIcon from "@/assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import messageIcon from "@/assets/icons/mail_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import starIcon from "@/assets/icons/star_24dp_FFD700_FILL0_wght400_GRAD0_opsz24.svg";

import { OrgMemberCard } from "@/components/OrgMemberCard";
import { NotificationCard } from "@/components/NotificationCard";

const OrganisationPage = () => {
  const { user } = useAuthContext();
  const { selectedOrg, setCustomModalContent, setIsLoading } = useSiteStore();
  const [orgNotifications, setOrgNotifications] = useState([]);
  const [userIsOwner, setUserIsOwner] = useState(false);

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

  const fetchOrgNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/notifications?filters[$or][0][senderId][$eq]=${selectedOrg.documentId}&filters[$or][1][receiverId][$eq]=${selectedOrg.documentId}`,
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
    }
  };

  useEffect(() => {
    fetchOrgNotifications();
    if (selectedOrg) {
      checkOwnership();
    }
  }, [selectedOrg]);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Stack gap="4rem">
        <Group align="flex-start">
          <PageTitle
            title={`${selectedOrg ? selectedOrg.name : ""}`}
            description={"Manage the organisation"}
            icon={<Avatar size="xl" radius={0} />}
          />
          {userIsOwner ? (
            <Group gap={0}>
              <Image w={50} h={50} src={starIcon} />{" "}
              <Text size="xs" fw={"bold"} c="gold">
                owner
              </Text>
            </Group>
          ) : null}
        </Group>

        <Divider />

        {userIsOwner ? (
          <>
            <Stack>
              <Group>
                <Image src={messageIcon} width={40} height={40} />
                <Title order={2} fw={300} tt="capitalize">
                  Messages
                </Title>
              </Group>
              <Text opacity={0.6} fw="400">
                Notifications and message activity for this organisation.
              </Text>
            </Stack>

            {selectedOrg && orgNotifications.length ? (
              <Grid>
                <Grid.Col span={6}>
                  <Stack>
                    <Text>
                      Recieved (
                      {
                        orgNotifications.filter(
                          (notif) => notif.receiverId === selectedOrg.documentId
                        ).length
                      }
                      )
                    </Text>
                  </Stack>

                  <Tabs defaultValue="rec-resolved">
                    <Tabs.List>
                      <Tabs.Tab value="rec-resolved">New</Tabs.Tab>
                      <Tabs.Tab value="rec-unresolved">History</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="rec-resolved">
                      {orgNotifications
                        .filter(
                          (notif) => notif.receiverId === selectedOrg.documentId
                        )
                        .filter((notif) => !notif.resolved)
                        .map((notif) => (
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
                    </Tabs.Panel>

                    <Tabs.Panel value="rec-unresolved">
                      {orgNotifications
                        .filter(
                          (notif) => notif.receiverId === selectedOrg.documentId
                        )
                        .filter((notif) => notif.resolved)
                        .map((notif) => (
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
                    </Tabs.Panel>
                  </Tabs>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack>
                    <Text>
                      Sent (
                      {
                        orgNotifications.filter(
                          (notif) => notif.senderId === selectedOrg.documentId
                        ).length
                      }
                      )
                    </Text>
                  </Stack>
                  <Tabs defaultValue="sent-resolved">
                    <Tabs.List>
                      <Tabs.Tab value="sent-resolved">New</Tabs.Tab>
                      <Tabs.Tab value="sent-unresolved">History</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="sent-resolved">
                      {orgNotifications
                        .filter(
                          (notif) => notif.senderId === selectedOrg.documentId
                        )
                        .filter((notif) => !notif.resolved)
                        .map((notif) => (
                          <>
                            <NotificationCard
                              user={user}
                              key={notif.documentId}
                              notif={notif}
                              isSender={
                                notif.senderId === selectedOrg.documentId
                                  ? true
                                  : false
                              }
                            />
                          </>
                        ))}
                    </Tabs.Panel>

                    <Tabs.Panel value="sent-unresolved">
                      {orgNotifications
                        .filter(
                          (notif) => notif.senderId === selectedOrg.documentId
                        )
                        .filter((notif) => notif.resolved)
                        .map((notif) => (
                          <NotificationCard
                            user={user}
                            key={notif.documentId}
                            notif={notif}
                            isSender={
                              notif.senderId === selectedOrg.documentId
                                ? true
                                : false
                            }
                          />
                        ))}
                    </Tabs.Panel>
                  </Tabs>
                </Grid.Col>
              </Grid>
            ) : (
              <Text opacity={0.5}>No messages</Text>
            )}
            <Divider />
          </>
        ) : null}

        <Stack>
          <Group>
            <Image src={membersIcon} width={40} height={40} />
            <Title order={2} fw={300} tt="capitalize">
              Members
            </Title>
          </Group>
          {userIsOwner ? (
            <Text opacity={0.6} fw="400">
              Manage this organisations members.
            </Text>
          ) : null}
        </Stack>

        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <Stack>
                <Text fw="500" tt="capitalize">
                  owners
                </Text>
                {userIsOwner ? (
                  <Button
                    color="black"
                    fw="400"
                    leftSection={<Image src={plusIcon} />}
                    onClick={() => setCustomModalContent({ type: "addOwner" })}
                    w="fit-content"
                  >
                    Add Owner
                  </Button>
                ) : null}
                {selectedOrg && selectedOrg.owners ? (
                  <Stack gap={0}>
                    {selectedOrg.owners.map((owner) => (
                      <OrgMemberCard
                        userIsOwner={userIsOwner}
                        cardIsOwner={true}
                        key={owner.username}
                        member={owner}
                        orgId={selectedOrg.documentId}
                      />
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
                {userIsOwner ? (
                  <Button
                    color="black"
                    fw="400"
                    leftSection={<Image src={plusIcon} />}
                    onClick={() => setCustomModalContent({ type: "addMember" })}
                    w="fit-content"
                  >
                    Add Members
                  </Button>
                ) : null}
                <Stack gap={0}>
                  {selectedOrg && selectedOrg.members ? (
                    <Stack gap={0}>
                      {selectedOrg.members.map((member) => (
                        <OrgMemberCard
                          userIsOwner={userIsOwner}
                          key={member.username}
                          member={member}
                          orgId={selectedOrg.documentId}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Text opacity={0.8}>No Members</Text>
                  )}
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>

        {userIsOwner ? (
          <>
            <Divider />
            <Stack>
              <Group>
                <Image src={vaultIcon} width={40} height={40} />
                <Title order={2} fw={300} tt="capitalize">
                  org vaults
                </Title>
              </Group>
              <Text opacity={0.6} fw="400">
                Manage this organisations vaults
              </Text>
            </Stack>
            <Stack>
              <Button
                onClick={() =>
                  setCustomModalContent({ type: "createOrgVault" })
                }
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
        ) : null}
      </Stack>
    </>
  );
};

export default OrganisationPage;
