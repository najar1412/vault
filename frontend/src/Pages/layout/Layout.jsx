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
import cartIcon from "../../assets/icons/shopping_cart_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import publicIcon from "../../assets/icons/visibility_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import marketIcon from "../../assets/icons/storefront_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import messageIcon from "../../assets/icons/mail_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";

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
    setRelatedOrgs,
    memberOrgs,
    setNotifications,
    notifications,
  } = useSiteStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchRelatedOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations?populate=vaults&filters[$or][0][members][username][$eq]=${user.username}&filters[$or][1][owners][username][$eq]=${user.username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setRelatedOrgs(data.data.length ? data.data : []);
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
        `${API}/notifications?filters[$or][0][receiverId][$eq]=${user.documentId}&filters[$or][1][senderId][$eq]=${user.documentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      console.log("((((((");
      console.log(data.data);
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
    await fetchRelatedOrgs();
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
          {user ? (
            <Grid.Col span={user ? 2 : 0}>
              <Stack gap={"xl"} p={"md"}>
                {/* <Link to="/profile" style={{ textDecoration: "none" }}>
                  <Group>
                    <Avatar />
                    <Text c={"black"} tt="capitalize">
                      {user.username}
                    </Text>
                  </Group>
                </Link> */}

                <NavLink
                  to="/profile"
                  /* className={({ isActive }) =>
                    isActive ? styles.active : styles["not-active"]
                  } */
                  style={{ textDecoration: "none" }}
                >
                  <Group gap={"xs"} wrap="no-wrap">
                    <Avatar />
                    <Text
                      td={"none"}
                      size="1.25rem"
                      c={"black"}
                      tt={"capitalize"}
                    >
                      {user.username}
                    </Text>
                  </Group>
                </NavLink>

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
                        General
                      </Text>

                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          isActive ? styles.active : styles["not-active"]
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Group gap={"xs"} wrap="no-wrap">
                          <Image src={marketIcon} />
                          <Text
                            size="sm"
                            td={"none"}
                            c={"black"}
                            tt={"capitalize"}
                            fw={"500"}
                          >
                            Market
                          </Text>
                        </Group>
                      </NavLink>

                      <Group>
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
                              size="sm"
                              td={"none"}
                              c={"black"}
                              tt={"capitalize"}
                              fw={"500"}
                            >
                              Organisation
                            </Text>
                          </Group>
                        </NavLink>
                        {notifications && notifications.length ? (
                          <Badge
                            size="xs"
                            color="blue"
                            p={0}
                            px="0.25rem"
                            py="0.45rem"
                          >
                            {notifications.length}
                          </Badge>
                        ) : null}
                      </Group>

                      {/* <NavLink
                      to="/reward-calculator"
                      className={({ isActive }) =>
                        isActive ? styles.active : styles["not-active"]
                      }
                      style={{ textDecoration: "none" }}
                    >
                      <Group gap={"xs"} wrap="no-wrap">
                        <Image src={rewardIcon} />
                        <Text
                          size="sm"
                          td={"none"}
                          c={"black"}
                          tt={"capitalize"}
                          fw={"500"}
                        >
                          rewards
                        </Text>
                      </Group>
                    </NavLink> */}
                    </Stack>

                    <Stack gap={"xs"}>
                      <Text tt="uppercase" opacity={0.5} size="xs" fw="400">
                        Organisation vaults
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
                                size="sm"
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
                          size="xs"
                          color="black"
                          fw="400"
                          leftSection={<Image src={plusIcon} />}
                          onClick={() =>
                            setCustomModalContent({
                              type: "createOrgVault",
                            })
                          }
                          w={"fit-content"}
                        >
                          Create Vault
                        </Button>
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
                        <Group key={vault.name} wrap="'no-wrap">
                          <NavLink
                            to={`/vault/${vault.documentId}`}
                            className={({ isActive }) =>
                              isActive ? styles.active : styles["not-active"]
                            }
                            style={{ textDecoration: "none" }}
                          >
                            <Group gap={"xs"} wrap="no-wrap">
                              {vault.marketable ? (
                                <Image src={cartIcon} />
                              ) : (
                                <Image src={inventoryIcon} />
                              )}
                              <Text
                                size="sm"
                                td={"none"}
                                c={"black"}
                                tt={"capitalize"}
                                fw={"500"}
                              >
                                {vault.name}
                              </Text>
                            </Group>
                          </NavLink>
                        </Group>
                      ))
                    ) : (
                      <Button
                        size="sm"
                        color="black"
                        fw="400"
                        leftSection={<Image src={plusIcon} />}
                        onClick={() =>
                          setCustomModalContent({ type: "createPersonalVault" })
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
                    <Group>
                      <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                          isActive ? styles.active : styles["not-active"]
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Group gap={"xs"} wrap="no-wrap">
                          <Image src={messageIcon} />
                          <Text
                            size="sm"
                            td={"none"}
                            c={"black"}
                            tt={"capitalize"}
                            fw={"500"}
                          >
                            messages
                          </Text>
                        </Group>
                      </NavLink>
                      {notifications && notifications.length ? (
                        <Badge
                          size="xs"
                          color="blue"
                          p={0}
                          px="0.25rem"
                          py="0.45rem"
                        >
                          {
                            notifications.filter((notif) => !notif.resolved)
                              .length
                          }
                        </Badge>
                      ) : null}
                    </Group>
                  </Stack>
                </>
              </Stack>
            </Grid.Col>
          ) : null}

          <Grid.Col span={user ? 10 : 12}>
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
