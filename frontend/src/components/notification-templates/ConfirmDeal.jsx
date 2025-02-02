import { Text, Button, Group, Fieldset } from "@mantine/core";

export const ConfirmDeal = ({ notif, isSender, user }) => {
  return (
    <>
      {isSender ? (
        <Text>You've agreed, waiting on seller to confirm.</Text>
      ) : (
        <Text>Buyer agrees to terms. Confirm to finalise trade.</Text>
      )}
      <Fieldset>
        <Group>
          <Text>{notif.itemId}</Text> {"x"} <Text>{notif.quantity}</Text> {">"}{" "}
          <Text>{notif.reward}</Text>
        </Group>
        <Group>
          <Text>Location: IMP</Text>
          <Text>Time: IMP</Text>
        </Group>
      </Fieldset>
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
