import { useNavigate, Link, NavLink } from "react-router";

import { Container, Group, Text, Avatar } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";

import { removeToken } from "../helpers";

import styles from "./Header.module.css";

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/signin", { replace: true });
  };

  return (
    <Container maw={"100%"} px={"lg"} py="xl">
      <Group>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles["not-active"]
          }
          style={{ textDecoration: "none" }}
        >
          <Text
            td={"none"}
            c={"black"}
            fw={"500"}
            tt={"capitalize"}
            size={"xl"}
          >
            Market
          </Text>
        </NavLink>

        {user ? (
          <>
            <NavLink
              to="/organisation"
              className={({ isActive }) =>
                isActive ? styles.active : styles["not-active"]
              }
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"xl"}>
                Organisation
              </Text>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? styles.active : styles["not-active"]
              }
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"xl"}>
                Player
              </Text>
            </NavLink>

            <NavLink
              to="/"
              onClick={handleLogout}
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"xl"}>
                Logout
              </Text>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                isActive ? styles.active : styles["not-active"]
              }
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"xl"}>
                Login
              </Text>
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? styles.active : styles["not-active"]
              }
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"xl"}>
                Sign up
              </Text>
            </NavLink>
          </>
        )}
      </Group>
    </Container>
  );
};

export default Header;
