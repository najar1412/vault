import { Avatar, Group, Text } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router";

export const Breadcrumbs = ({ breadcrumbs }) => {
  const { user } = useAuthContext();
  return (
    <Group justify="space-between">
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

      <Link to="/profile" style={{ textDecoration: "none" }}>
        <Group>
          <Avatar />
          <Text size="sm" c={"black"} tt="capitalize">
            {user ? user.username : null}
          </Text>
        </Group>
      </Link>
    </Group>
  );
};
