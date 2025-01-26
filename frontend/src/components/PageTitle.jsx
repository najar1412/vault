import { Stack, Text, Title } from "@mantine/core";

export const PageTitle = ({ title, description }) => {
  return (
    <Stack gap={0}>
      <Title tt="capitalize" fw="500">
        {title}
      </Title>
      <Text opacity={0.6}>{description}</Text>
    </Stack>
  );
};
