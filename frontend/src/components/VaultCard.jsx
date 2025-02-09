import { Group, Text, UnstyledButton, Image, Box, Avatar } from "@mantine/core";
import { Link } from "react-router";

import { useSiteStore } from "../Store";
import { API } from "../constant";
import { getToken } from "../helpers";

import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import editIcon from "../assets/icons/edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import inventoryIcon from "../assets/icons/package_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export const VaultCard = ({ vault, isPersonalVault }) => {
  const {
    setUserVaults,
    userVaults,
    selectedOrg,
    setSelectedOrg,
    setIsLoading,
  } = useSiteStore();

  const handleDeleteVault = async () => {
    await fetchDelVault();
  };

  const fetchDelVault = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/vaults/${vault.documentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (isPersonalVault) {
        return setUserVaults(
          userVaults.filter(
            (userVault) => userVault.documentId !== vault.documentId
          )
        );
      }

      try {
        const response = await fetch(
          `${API}/organisations/${selectedOrg.documentId}?populate=vaults`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        const newOrg = await response.json();
        setSelectedOrg(newOrg.data);
        return newOrg;
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      key={vault.name}
      w="fit-content"
      m="6"
      style={{
        backgroundColor: "white",
        borderRadius: "0.2rem",
        filter: "drop-shadow(0px 0px 2px rgb(230, 230, 230))",
      }}
    >
      <Group gap={"0rem"}>
        <Avatar radius="0" size="md">
          <Image src={inventoryIcon} />
        </Avatar>
        <Group gap={"5rem"} px={12}>
          <Link
            to={`/vault/${vault.documentId}`}
            style={{ textDecoration: "none" }}
          >
            <Text tt="capitalize" c="black">
              {vault.name}
            </Text>
          </Link>

          <Group>
            <UnstyledButton>
              <Image src={editIcon} />
            </UnstyledButton>
            <UnstyledButton onClick={() => handleDeleteVault()}>
              <Image src={deleteIcon} />
            </UnstyledButton>
          </Group>
        </Group>
      </Group>
    </Box>
  );
};
