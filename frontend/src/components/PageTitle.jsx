import { Avatar, Group, Stack, Text, Title } from "@mantine/core";

export const PageTitle = ({ title, description, icon }) => {
  return (
    <Group>
      {icon ? icon : null}
      <Stack gap={0}>
        <Title size="3rem" tt="capitalize" fw="200">
          {title}
        </Title>
        <Text fw="300" opacity={0.6}>
          {description}
        </Text>
      </Stack>
    </Group>
  );
};
