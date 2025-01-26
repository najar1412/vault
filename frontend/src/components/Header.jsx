import { useNavigate, Link } from "react-router";

import { Container, Group, Text } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";

import { removeToken } from "../helpers";

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/signin", { replace: true });
  };

  return (
    <Container
      maw={"100%"}
      px={"3.5rem"}
      py="xs"
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {user ? (
        <Group>
          <Text
            onClick={handleLogout}
            td={"none"}
            c={"black"}
            tt={"capitalize"}
            opacity={0.7}
            style={{
              cursor: "pointer",
            }}
          >
            logout
          </Text>
        </Group>
      ) : (
        <Group>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Text td={"none"} c={"black"} tt={"capitalize"} opacity={0.7}>
              home
            </Text>
          </Link>

          <Link to={"/signin"} style={{ textDecoration: "none" }}>
            <Text td={"none"} c={"black"} tt={"capitalize"} opacity={0.7}>
              login
            </Text>
          </Link>

          <Link to={"/signup"} style={{ textDecoration: "none" }}>
            <Text td={"none"} c={"black"} tt={"capitalize"} opacity={0.7}>
              signup
            </Text>
          </Link>

          <Link to={"/about"} style={{ textDecoration: "none" }}>
            <Text td={"none"} c={"black"} tt={"capitalize"} opacity={0.7}>
              about
            </Text>
          </Link>
        </Group>
      )}
    </Container>
  );
};

export default Header;
