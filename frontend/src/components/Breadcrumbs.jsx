import { Avatar, Group, Text } from "@mantine/core";

export const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <Group>
      <Avatar />
      {breadcrumbs.map((item, index) => (
        <>
          <Text
            tt="capitalize"
            fw="500"
            size="xs"
            opacity={index >= breadcrumbs.length - 1 ? 1 : 0.5}
          >
            {item.label}
          </Text>
          {index >= breadcrumbs.length - 1 ? null : (
            <Text opacity={0.5}>{">"}</Text>
          )}
        </>
      ))}
    </Group>
  );
};
