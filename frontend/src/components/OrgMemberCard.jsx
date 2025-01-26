import { Group, Text, UnstyledButton, Image, Box, Avatar } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router";
import { API } from "../constant";
import { getToken } from "../helpers";
import deleteIcon from "../assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import editIcon from "../assets/icons/edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../assets/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";


export const OrgMemberCard = ({ member }) => {
  /* const { setUserVaults, userVaults, selectedOrg, setSelectedOrg } =
    useSiteStore(); */
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteVault = async () => {
    // delete owner from organ
    //await fetchDeleteOrg();
  };
  const fetchDeleteOrg = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations/members/${member.documentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
      });

      return response;
      // setOwners(data.data.owners.length ? data.data.owners : false);
      // setMembers(data.data.members.length ? data.data.members : false);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
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
                  <UnstyledButton onClick={() => handleDeleteVault()}>
                    <Image src={deleteIcon} />
                  </UnstyledButton>
                </Group>
              </Group>
            </Group>




    </Box>
  );
};
