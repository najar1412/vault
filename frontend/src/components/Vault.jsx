import { useState } from "react";

import { Container, Stack } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";

import { API } from "../constant";
import { getToken } from "../helpers";

const Vault = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user, isLoading, setUser } = useAuthContext();

  if (isLoading) {
    return "loading...";
  }

  return (
    <Container maw={"100%"} mx="0" p={0}>
      <Stack>{children.map((child) => child)}</Stack>
    </Container>
  );
};

export default Vault;
