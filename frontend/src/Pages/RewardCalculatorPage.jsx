import { useState, useEffect } from "react";

import { Group, Text, Stack, Button, NumberInput, Image } from "@mantine/core";
import { useForm } from "@mantine/form";

import RewardRow from "../components/RewardRow";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { CustomComboboxUser } from "../components/CustomComboboxUser";

import { characters } from "../data/data";

import { useSiteStore } from "../Store";
import { API } from "../constant";
import { getToken } from "../helpers";

import plusIcon from "../assets/icons/add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";

const RewardCalculatorPage = () => {
  const { selectedOrg } = useSiteStore();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [toCalculate, setToCalculate] = useState(characters);
  const [results, setReults] = useState(null);

  const breadcrumbs = [
    {
      label: selectedOrg ? selectedOrg.name : '',
      link: "",
    },
    {
      label: "reward calculator",
      link: "",
    },
  ];

  const onCalculate = () => {
    setReults(toCalculate);
  };

  const appendCalculate = (newCharacter, key, value) => {
    const existingCharacter = toCalculate.filter(
      (char) => char.username === newCharacter.username
    );
    if (existingCharacter.length) {
      newCharacter[key] = value;

      setToCalculate([
        ...toCalculate.filter(
          (char) => char.username !== newCharacter.username
        ),
        newCharacter,
      ]);
    } else {
      newCharacter[key] = value;
      setToCalculate([...toCalculate, newCharacter]);
    }
  };

  const appendBid = (newCharacter, key, value) => {
    console.log("appendBid");
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/organisations/${selectedOrg.documentId}?populate=owners&populate=members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      const allMembers = data.data.owners.concat(data.data.members);
      setMembers(allMembers);
      // console.log(allMembers);
      // setOwners(data.data.owners.length ? data.data.owners : false);
      // setMembers(data.data.members.length ? data.data.members : false);
    } catch (error) {
      console.error(error);
      // message.error("Error while fetching profiles!");
    } finally {
      setIsLoading(false);
    }
  };

  const addParticipant = (value) => {
    setParticipants([
      ...participants,
      members.filter((member) => member.username === value)[0],
    ]);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (isLoading) {
    return "loading...";
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <PageTitle
        title={`reward calculator`}
        description={"words, things and stuff"}
      />

      <Stack gap={"xs"}>
        <Group wrap="no-wrap">
          <CustomComboboxUser
            data={members ? members : false}
            selected={addParticipant}
          />
        </Group>
        {participants.map((character) => (
          <Group key={character.username}>
            <Text>{character.username}</Text>
            <Text>{character.points}</Text>

            <RewardRow
              character={character}
              appendCalculate={appendCalculate}
            />
            <NumberInput
              placeholder="Bid amount"
              onChange={(e) => appendBid(character, "bid", e)}
            />
          </Group>
        ))}
      </Stack>
      <Button
        w="fit-content"
        type="submit"
        color="black"
        fw="400"
        onClick={() => onCalculate()}
      >
        Calculate
      </Button>
      <Stack gap={"xs"}>
        {results
          ? results.map((result) => (
              <Group key={result.username}>
                <Text>{result.username}</Text>
                <Text>{result.ship}</Text>
                <Text>
                  {result.points} - {result.bid}
                </Text>
                <Button fw="400" variant="outline" color="black">
                  Accept
                </Button>
              </Group>
            ))
          : null}
      </Stack>
    </>
  );
};

export default RewardCalculatorPage;
