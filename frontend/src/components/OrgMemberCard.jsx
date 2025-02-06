import { Group, Text, UnstyledButton, Image, Box, Avatar } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router";
import { API } from "../constant";
import { getToken } from "../helpers";
import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import editIcon from "../assets/icons/edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../assets/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export const OrgMemberCard = ({ member, orgId }) => {
  /* const { setUserVaults, userVaults, selectedOrg, setSelectedOrg } =
    useSiteStore(); */
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteVault = async () => {
    // delete owner from organ
    //await fetchDeleteOrg();
  };
  const removeMemberFromOrg = async (member, orgId) => {
    try {
      const response = await fetch(`${API}/organisations/${orgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            members: { disconnect: [member.documentId] },
          },
        }),
      });
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Box
      key={member.username}
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
          <Image src={profileIcon} />
        </Avatar>
        <Group gap={"5rem"} px={12}>
          <Text tt="capitalize" c="black">
            {member.username}
          </Text>

          <Group>
            <UnstyledButton>
              <Image src={editIcon} />
            </UnstyledButton>
            <UnstyledButton onClick={() => removeMemberFromOrg(member, orgId)}>
              <Image src={deleteIcon} />
            </UnstyledButton>
          </Group>
        </Group>
      </Group>
    </Box>
  );
};
