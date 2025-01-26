import { useState, useEffect } from "react";

import { Outlet, Link, NavLink } from "react-router";
import { useNavigate } from "react-router";
import {
  Stack,
  Grid,
  Text,
  Group,
  Image,
  Container,
  Avatar,
  Button,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { CustomCombobox } from "../../components/CustomCombobox";
import { useSiteStore } from "../../Store";
import { useAuthContext } from "../../context/AuthContext";
import { CustomModal } from "../../components/CustomModal";

import { API } from "../../constant";
import { getToken } from "../../helpers";

import styles from "./Layout.module.css";

import rewardIcon from "../../assets/icons/featured_seasonal_and_gifts_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import inventoryIcon from "../../assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import orgIcon from "../../assets/icons/build_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import plusIcon from "../../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import notificationIcon from "../../assets/icons/notifications_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

function Layout() {
  const {
    selectedOrg,
    setSelectedOrg,
    setUserVaults,
    userVaults,
    setCustomModal,
    customModal,
    setOwnerOrgs,
    setCustomModalContent,
    setMemberOrgs,
    memberOrgs,
    setNotifications,
    notifications,
  } = useSiteStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMemberOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations?populate=vaults&filters[members][username][$eq]=${user.username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setMemberOrgs(data.data.length ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchOwnerOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations?populate=vaults&filters[owners][username][$eq]=${user.username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.clone().json();
      setOwnerOrgs(data.data.length ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserNotifications = async (user) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/notifications?filters[receiverId][$eq]=${user.documentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setNotifications(data.data ? data.data : []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrgs = async () => {
    // setIsLoading(true);
    await fetchOwnerOrgs();
    await fetchMemberOrgs();
    await fetchUser();
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/users/me?populate=vaults`, {
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();
      // setUser(data)
      setUserVaults(data.vaults ?? []);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrg = async (documentId) => {
    try {
      const response = await fetch(
        `${API}/organisations/${documentId}?populate=vaults&populate=members&populate=owners`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const newOrg = await response.json();
      setSelectedOrg(newOrg.data);
      return newOrg;
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedOrg = async (name) => {
    const org = memberOrgs.filter((org) => org.name === name);
    await fetchOrg(org[0].documentId);
    navigate("/organisation");
  };

  useEffect(() => {
    if (user) {
      fetchOrgs();
      setCustomModal({ opened: opened, open: open, close: close });
      fetchUserNotifications(user);
    }
  }, [user]);

  return (
    <>
      <CustomModal opened={opened} close={close} />
      <Container
        maw={"100%"}
        h={"100%"}
        mx="md"
        p={"xs"}
        bg={"rgb(250, 250, 250)"}
        style={{
          borderRadius: "1rem",
          filter: "drop-shadow(0px 0px 4px rgb(230, 230, 230))",
        }}
      >
        <Grid h={"100%"}>
          <Grid.Col span={2}>
            <Stack gap={"xl"} p={"md"}>
              <>
                <Group justify="space-between">
                  <Group>
                    <Avatar />
                    <Text fw="500" tt={"capitalize"}>
                      org tools
                    </Text>
                  </Group>
                  <Text opacity={0.5}>v0.1</Text>
                </Group>
                {memberOrgs.length ? (
                  <Stack gap={"xs"} w="100%">
                    <Text tt="uppercase" opacity={0.5} size="xs" fw="500">
                      Selected Org
                    </Text>
                    <Group w="100%">
                      {memberOrgs.length ? (
                        <CustomCombobox
                          data={memberOrgs}
                          selected={handleSelectedOrg}
                        />
                      ) : (
                        <Link href="/profile">
                          <Button
                            color="black"
                            fw="400"
                            leftSection={<Image src={plusIcon} />}
                            // onClick={open}
                            w={"fit-content"}
                          >
                            Org settings
                          </Button>
                        </Link>
                      )}
                    </Group>
                  </Stack>
                ) : null}

                {selectedOrg ? (
                  <>
                    <Stack gap={"xs"}>
                      <Text tt="uppercase" opacity={0.5} size="xs" fw="400">
                        general
                      </Text>

                      <NavLink
                        to="/organisation"
                        className={({ isActive }) =>
                          isActive ? styles.active : styles["not-active"]
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Group gap={"xs"} wrap="no-wrap">
                          <Image src={orgIcon} />
                          <Text
                            td={"none"}
                            c={"black"}
                            tt={"capitalize"}
                            fw={"500"}
                          >
                            Organisation
                          </Text>
                        </Group>
                      </NavLink>

                      <NavLink
                        to="/reward-calculator"
                        className={({ isActive }) =>
                          isActive ? styles.active : styles["not-active"]
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Group gap={"xs"} wrap="no-wrap">
                          <Image src={rewardIcon} />
                          <Text
                            td={"none"}
                            c={"black"}
                            tt={"capitalize"}
                            fw={"500"}
                          >
                            rewards
                          </Text>
                        </Group>
                      </NavLink>
                    </Stack>

                    <Stack gap={"xs"}>
                      <Text tt="uppercase" opacity={0.5} size="xs" fw="400">
                        Org vaults
                      </Text>
                      {selectedOrg &&
                      selectedOrg.vaults &&
                      selectedOrg.vaults.length ? (
                        selectedOrg.vaults.map((vault) => (
                          <NavLink
                            key={vault.name}
                            to={`/vault/${vault.documentId}`}
                            className={({ isActive }) =>
                              isActive ? styles.active : styles["not-active"]
                            }
                            style={{ textDecoration: "none" }}
                          >
                            <Group gap={"xs"} wrap="no-wrap">
                              <Image src={inventoryIcon} />
                              <Text
                                td={"none"}
                                c={"black"}
                                tt={"capitalize"}
                                fw={"500"}
                              >
                                {vault.name}
                              </Text>
                            </Group>
                          </NavLink>
                        ))
                      ) : (
                        <Text>only owners can make org vaults</Text>
                      )}
                    </Stack>
                  </>
                ) : null}
                <>
                  <Stack gap={"xs"}>
                    <Text tt="uppercase" opacity={0.5} size="xs" fw="400">
                      personal vaults
                    </Text>
                    {userVaults && userVaults.length ? (
                      userVaults.map((vault) => (
                        <NavLink
                          key={vault.name}
                          to={`/vault/${vault.documentId}`}
                          className={({ isActive }) =>
                            isActive ? styles.active : styles["not-active"]
                          }
                          style={{ textDecoration: "none" }}
                        >
                          <Group gap={"xs"} wrap="no-wrap">
                            <Image src={inventoryIcon} />
                            <Text
                              td={"none"}
                              c={"black"}
                              tt={"capitalize"}
                              fw={"500"}
                            >
                              {vault.name}
                            </Text>
                          </Group>
                        </NavLink>
                      ))
                    ) : (
                      <Button
                        color="black"
                        fw="400"
                        leftSection={<Image src={plusIcon} />}
                        onClick={() =>
                          setCustomModalContent("createPersonalVault")
                        }
                        w={"fit-content"}
                      >
                        Create Vault
                      </Button>
                    )}
                  </Stack>

                  <Stack gap={"xs"}>
                    <Text tt="uppercase" opacity={0.5} size="xs" fw="400">
                      settings
                    </Text>

                    <NavLink
                      to="/notifications"
                      className={({ isActive }) =>
                        isActive ? styles.active : styles["not-active"]
                      }
                      style={{ textDecoration: "none" }}
                    >
                      <Group gap={"xs"} wrap="no-wrap">
                        <Image src={notificationIcon} />
                        <Text
                          td={"none"}
                          c={"black"}
                          tt={"capitalize"}
                          fw={"500"}
                        >
                          notifications
                        </Text>
                        {notifications && notifications.length ? (
                          <Badge>{notifications.length}</Badge>
                        ) : null}
                      </Group>
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive ? styles.active : styles["not-active"]
                      }
                      style={{ textDecoration: "none" }}
                    >
                      <Group gap={"xs"} wrap="no-wrap">
                        <Image src={profileIcon} />
                        <Text
                          td={"none"}
                          c={"black"}
                          tt={"capitalize"}
                          fw={"500"}
                        >
                          profile
                        </Text>
                      </Group>
                    </NavLink>
                  </Stack>
                </>
              </>
            </Stack>
          </Grid.Col>
          <Grid.Col span={10}>
            <Container
              maw={"100%"}
              h={"fit-content"}
              mx="0"
              py={"md"}
              px={"xl"}
              bg={"white"}
              style={{
                borderRadius: "1rem",
                filter: "drop-shadow(0px 0px 2px rgb(230, 230, 230))",
              }}
            >
              <Stack gap="xl">
                <Outlet />
              </Stack>
            </Container>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default Layout;
