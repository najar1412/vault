import { Group, Text, UnstyledButton, Image, Box, Avatar } from "@mantine/core";
import { Link } from "react-router";

import { API } from "../constant";
import { getToken } from "../helpers";
import { useSiteStore } from "../Store";
import { useAuthContext } from "../context/AuthContext";

import leaveIcon from "../assets/icons/logout_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import groupIcon from "../assets/icons/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export const OrgCard = ({ cardIsOwner, organisation }) => {
  const { user } = useAuthContext();
  const { setSelectedOrg, setIsLoading, setRelatedOrgs } = useSiteStore();

  const fetchRelatedOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations?populate=vaults&filters[$or][0][members][username][$eq]=${user.username}&filters[$or][1][owners][username][$eq]=${user.username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      return data.data.length ? data.data : [];
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (member, orgId) => {
    if (cardIsOwner) {
      await fetchOwnerFromOrg(member, orgId);
    } else {
      await fetchRemoveMemberFromOrg(member, orgId);
    }

    const relatedOrgs = await fetchRelatedOrgs();
    setRelatedOrgs(relatedOrgs);
  };

  const fetchRemoveMemberFromOrg = async (member, orgId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations/${orgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      setIsLoading(false);
    }
  };

  const fetchOwnerFromOrg = async (member, orgId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/organisations/${orgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            owners: { disconnect: [member.documentId] },
          },
        }),
      });
      const tData = await response.json();
      return tData;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      key={organisation.documentId}
      w="fit-content"
      m="6"
      style={{
        backgroundColor: "white",
        borderRadius: "0.2rem",
        filter: "drop-shadow(0px 0px 2px rgb(230, 230, 230))",
      }}
    >
      <Group gap={"0rem"}>
        <Avatar radius="0" size="lg">
          <Image src={groupIcon} />
        </Avatar>
        <Group gap={"5rem"} px={12}>
          <Link
            to={`/organisation`}
            onClick={() => setSelectedOrg(organisation)}
            style={{ textDecoration: "none" }}
          >
            <Text tt="capitalize" c="black">
              {organisation.name}
            </Text>
          </Link>

          <Group>
            <UnstyledButton
              onClick={() => handleRemoveMember(user, organisation.documentId)}
            >
              <Image src={leaveIcon} />
            </UnstyledButton>
          </Group>
        </Group>
      </Group>
    </Box>
  );
};
