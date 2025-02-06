import { Text, Button, Group, Fieldset } from "@mantine/core";

export const CancelOrgInvite = ({ notif, isSender, user }) => {
  return (
    <>
      {isSender ? (
        <Text>You've agreed, waiting on seller to confirm.</Text>
      ) : (
        <Text>Buyer agrees to terms. Confirm to finalise trade.</Text>
      )}
      {notif.requiresConfirmation ? (
        isSender ? (
          <Group>
            <Button color="green" disabled>
              accepted
            </Button>
            <Button color="red">back out</Button>
          </Group>
        ) : (
          <Group>
            <Button>confirm</Button>
            <Button color="red">back out</Button>
          </Group>
        )
      ) : null}
    </>
  );
};
