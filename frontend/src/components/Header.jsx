import { useNavigate, NavLink } from "react-router";

import { Container, Group, Text, Avatar, Divider } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";
import { useSiteStore } from "../Store";

import { removeToken } from "../helpers";

import styles from "./Header.module.css";

const Header = () => {
  const { user, logoutUser } = useAuthContext();
  const { selectedOrg } = useSiteStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <Container maw={"100%"} px={"lg"} py="xl">
      <Group justify="space-between">
        <Group>
          <Group gap="xs">
            <Avatar /> <Text>Org tools</Text> <Divider orientation="vertical" />
          </Group>

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
              size={"md"}
            >
              Market
            </Text>
          </NavLink>
          {user ? (
            <>
              {selectedOrg ? (
                <NavLink
                  to="/organisation"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles["not-active"]
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
                    Organisation
                  </Text>
                </NavLink>
              ) : null}

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? styles.active : styles["not-active"]
                }
                style={{ textDecoration: "none" }}
              >
                <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
                  Player
                </Text>
              </NavLink>
            </>
          ) : null}
        </Group>

        <Group>
          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              isActive ? styles.active : styles["not-active"]
            }
            style={{ textDecoration: "none" }}
          >
            <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
              roadmap
            </Text>
          </NavLink>
          {user ? (
            <NavLink
              to="/"
              onClick={handleLogout}
              style={{ textDecoration: "none" }}
            >
              <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
                Logout
              </Text>
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  isActive ? styles.active : styles["not-active"]
                }
                style={{ textDecoration: "none" }}
              >
                <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
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
                <Text td={"none"} c={"black"} tt={"capitalize"} size={"md"}>
                  Sign up
                </Text>
              </NavLink>
            </>
          )}
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
