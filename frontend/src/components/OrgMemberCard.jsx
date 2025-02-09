import { Group, Text, UnstyledButton, Image, Avatar } from "@mantine/core";
import { useNavigate } from "react-router";

import { useSiteStore } from "@/Store";
import { useAuthContext } from "@/context/AuthContext";
import { API } from "@/constant";
import { getToken } from "@/helpers";

import deleteIcon from "@/assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import exitIcon from "@/assets/icons/exit_to_app_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "@/assets/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export const OrgMemberCard = ({ userIsOwner, member, orgId }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setIsLoading, selectedOrg, setSelectedOrg, setRelatedOrgs } =
    useSiteStore();

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
    console.log("handleRemoveMember");
    if (userIsOwner) {
      await fetchOwnerFromOrg(member, orgId);
      // update state
      selectedOrg.members = selectedOrg.owners.filter(
        (orgMember) => orgMember.documentId != member.documentId
      );
      setSelectedOrg(selectedOrg);
    } else {
      // await fetchRemoveMemberFromOrg(member, orgId);
      // update state
      const relatedOrgs = await fetchRelatedOrgs();
      setRelatedOrgs(relatedOrgs);
      setSelectedOrg(null);
      if (member.documentId === user.documentId) {
        navigate("/profile", { replace: true });
      }
    }
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
    <Group
      gap={"0rem"}
      m="6"
      style={{
        backgroundColor:
          userIsOwner && member.documentId === user.documentId
            ? "gold"
            : "white",
        borderRadius: "0.2rem",
        filter: "drop-shadow(0px 0px 2px rgb(230, 230, 230))",
      }}
      justify="space-between"
    >
      <Group>
        <Avatar radius="0" size="md">
          <Image src={profileIcon} />
        </Avatar>

        <Text tt="capitalize" c="black">
          {member.username}
        </Text>
      </Group>
      {userIsOwner || member.documentId === user.documentId ? (
        <Group pr="sm">
          <UnstyledButton onClick={() => handleRemoveMember(member, orgId)}>
            {member.documentId === user.documentId ? (
              <Image src={exitIcon} />
            ) : (
              <Image src={deleteIcon} />
            )}
          </UnstyledButton>
        </Group>
      ) : null}
    </Group>
  );
};
