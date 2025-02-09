import { useNavigate } from "react-router";
import { Alert, Group, Button, Text, Stack } from "@mantine/core";

import { ConfirmDeal } from "./notification-templates/ConfirmDeal";
import { CancelOrgInvite } from "./notification-templates/CancelOrgInvite";

import { useAuthContext } from "../context/AuthContext";
import { useSiteStore } from "@/Store";
import { getToken } from "@/helpers";
import { API } from "@/constant";

export const NotificationCard = ({ notif, isSender }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { setIsLoading, setRelatedOrgs } = useSiteStore();
  const HandleTemplateSelect = ({ notif }) => {
    if (notif.type === "confirm-deal") {
      return <ConfirmDeal isSender={isSender} notif={notif} />;
    } else if (notif.type === "add-to-org-member") {
      <CancelOrgInvite isSender={isSender} notif={notif} />;
    }
  };

  const cancelNotification = async (notifDocumentId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/notifications/${notifDocumentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            terminated: true,
            resolved: true,
          },
        }),
      });
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotification = async (notifDocumentId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/notifications/${notifDocumentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            confirmationConfirmed: true,
            resolved: true,
          },
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMemberToOrg = async (notif) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations/${notif.senderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            members: { connect: [notif.receiverId] },
          },
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations?populate=vaults&filters[$or][0][members][username][$eq]=${user.username}&filters[$or][1][owners][username][$eq]=${user.username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      return data.data.length ? data.data : [];
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrgInvite = async (notif) => {
    await updateNotification(notif.documentId);
    await addMemberToOrg(notif);
    const relatedOrgs = await fetchRelatedOrgs();
    setRelatedOrgs(relatedOrgs);
    navigate("/organisation", { replace: true });
  };

  return (
    <Alert
      withCloseButton
      key={notif.documentId}
      variant={isSender ? "light" : "light"}
      color={notif.resolved ? "lightgray" : notif.terminated ? "red" : "blue"}
      title={isSender ? `${notif.type}-sender` : `${notif.type}`}
    >
      <Stack>
        {notif.terminated ? <Text>TERMINATED</Text> : null}
        <HandleTemplateSelect notif={notif} />

        {isSender ? (
          !notif.resolved && notif.requiresConfirmation ? (
            <Group>
              <Text>{notif.type}</Text>
              <Button
                variant="outline"
                color="red"
                onClick={() => cancelNotification(notif.documentId)}
              >
                Cancel Invite
              </Button>
            </Group>
          ) : null
        ) : !notif.resolved && notif.requiresConfirmation ? (
          <Group>
            <Text>{notif.type}</Text>
            <Button onClick={() => handleAcceptOrgInvite(notif)}>accept</Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => cancelNotification(notif.documentId)}
            >
              reject
            </Button>
          </Group>
        ) : null}

        <Group>
          <Text size="xs" opacity={0.5}>
            {notif.senderId} {">"} {notif.receiverId}
          </Text>
        </Group>
      </Stack>
    </Alert>
  );
};
