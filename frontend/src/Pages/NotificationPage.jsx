import { useState } from "react";

import {
  Text,
  Group,
  Button,
  Stack,
  Title,
  Grid,
  Alert,
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

const NotificationPage = () => {
  const { notifications } = useSiteStore();
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
      <PageTitle
        title={`notifications`}
        description={"words, things and stuff"}
      />
      <Stack gap="xs">
        <Stack>
          {notifications.map((notif) => (
            <>
              <Alert
                withCloseButton
                key={notif.documentId}
                variant="light"
                color={notif.resolved ? "gray" : "blue"}
                title={notif.type}
                icon={orgIcon.src}
              >
                <Group>
                  <Text>{notif.type}</Text>
                  {!notif.resolved && (
                    <>
                      <Button
                        color={notif.confirmationConfirmed ? "green" : "blue"}
                        onClick={() =>
                          notif.resolved
                            ? null
                            : handleAddMemberToOrg(notif.documentId)
                        }
                      >
                        accept
                      </Button>
                      <Button>reject</Button>
                    </>
                  )}
                </Group>

                <Group>
                  <Text size="xs" opacity={0.5}>
                    {notif.senderId} {">"} {notif.receiverId}
                  </Text>
                </Group>
              </Alert>
            </>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default NotificationPage;
