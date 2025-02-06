import { useState } from "react";

import {
  Text,
  Group,
  Button,
  Stack,
  Title,
  Grid,
  Alert,
  Tabs,
  Divider,
} from "@mantine/core";
import { useNavigate } from "react-router";

import { useAuthContext } from "../context/AuthContext";
import { PageTitle } from "../components/PageTitle";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { NotificationCard } from "../components/NotificationCard";

import { API } from "../constant";
import { getToken } from "../helpers";
import { useSiteStore } from "../Store";

import plusIcon from "../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import vaultIcon from "../assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import orgIcon from "../assets/icons/build_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import notificationIcon from "../assets/icons/notifications_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import membersIcon from "../assets/icons/group_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import { VaultCard } from "../components/VaultCard";
import { OrgCard } from "../components/OrgCard";

const NotificationPage = () => {
  const { notifications } = useSiteStore();
  const [loading, setLoading] = useState(false);
  const { user, isLoading, setUser } = useAuthContext();

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const breadcrumbs = [
    {
      label: "player",
      link: "",
    },
    {
      label: "messages",
      link: "",
    },
  ];

  if (isLoading) {
    return "loading...";
  }

  const acceptOrgInvite = async (notifDocumentId) => {
    try {
      const response = await fetch(`${API}/notifications/${notifDocumentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            confirmationConfirmed: true,
            resolved: true,
          },
        }),
      });
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const addMemberToOrg = async (updatedNotif) => {
    try {
      const response = await fetch(
        `${API}/organisations/${updatedNotif.senderId}?populate=members`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            data: {
              members: { connect: [updatedNotif.receiverId] },
            },
          }),
        }
      );
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleAddMemberToOrg = async (notifDocumentId) => {
    const updatedNotif = await acceptOrgInvite(notifDocumentId);
    await addMemberToOrg(updatedNotif.data);
  };
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Stack gap="4rem">
        <PageTitle
          title={`messages`}
          description={"Manage all player notifications and messages"}
        />
        <Divider />
        <Stack>
          {notifications.length ? (
            <Grid>
              <Grid.Col span={6}>
                <Stack>
                  <Text>
                    Recieved (
                    {
                      notifications.filter(
                        (notif) => notif.receiverId === user.documentId
                      ).length
                    }
                    )
                  </Text>
                </Stack>

                <Tabs defaultValue="rec-unresolved">
                  <Tabs.List>
                    <Tabs.Tab value="rec-unresolved">New</Tabs.Tab>
                    <Tabs.Tab value="rec-resolved">Resolved</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="rec-unresolved">
                    <Stack>
                      {notifications
                        .filter((notif) => notif.receiverId === user.documentId)
                        .filter((notif) => !notif.resolved)
                        .map((notif) => (
                          <NotificationCard
                            user={user}
                            key={notif.documentId}
                            notif={notif}
                            isSender={false}
                          />
                        ))}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="rec-resolved">
                    <Stack>
                      {notifications
                        .filter((notif) => notif.receiverId === user.documentId)
                        .filter((notif) => notif.resolved)
                        .map((notif) => (
                          <NotificationCard
                            user={user}
                            key={notif.documentId}
                            notif={notif}
                            isSender={false}
                          />
                        ))}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack>
                  <Text>Sent {
                      notifications.filter(
                        (notif) => notif.senderId === user.documentId
                      ).length
                    }</Text>
                </Stack>
                <Tabs defaultValue="sent-resolved">
                  <Tabs.List>
                    <Tabs.Tab value="sent-resolved">New</Tabs.Tab>
                    <Tabs.Tab value="sent-unresolved">Resolved</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="sent-resolved">
                    <Stack>
                      {notifications
                        .filter((notif) => notif.senderId === user.documentId)
                        .filter((notif) => !notif.resolved)
                        .map((notif) => (
                          <NotificationCard
                            user={user}
                            key={notif.documentId}
                            notif={notif}
                            isSender={true}
                          />
                        ))}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="sent-unresolved">
                    <Stack>
                      {notifications
                        .filter((notif) => notif.senderId === user.documentId)
                        .filter((notif) => notif.resolved)
                        .map((notif) => (
                          <NotificationCard
                            user={user}
                            key={notif.documentId}
                            notif={notif}
                            isSender={true}
                          />
                        ))}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Grid.Col>
            </Grid>
          ) : (
            <Text>No messages</Text>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default NotificationPage;
