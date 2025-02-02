import { Alert, Group, Button, Text, Stack } from "@mantine/core";

import { ConfirmDeal } from "./notification-templates/ConfirmDeal";

export const NotificationCard = ({ children, notif, isSender, user }) => {
  // const senderContent = notif.senderId === user.documentId;
  const HandleTemplateSelect = ({ notif }) => {
    if (notif.type === "confirm-deal") {
      return <ConfirmDeal isSender={isSender} notif={notif} />;
    }
  };
  return (
    <Alert
      withCloseButton
      key={notif.documentId}
      variant={isSender ? "light" : "light"}
      color={notif.resolved ? "lightgray" : "blue"}
      title={isSender ? `${notif.type}-sender` : `${notif.type}`}
    >
      <Stack>
        <HandleTemplateSelect notif={notif} />
        {children}

        

        <Group>
          <Text size="xs" opacity={0.5}>
            {notif.senderId} {">"} {notif.receiverId}
          </Text>
        </Group>
      </Stack>
    </Alert>
  );
};
