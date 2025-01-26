import { useState } from "react";

import {
  Table,
  Group,
  Avatar,
  Text,
  Button,
  TextInput,
  Image,
  UnstyledButton,
} from "@mantine/core";

import { ItemQuantity } from "./ItemQuantity";

import { useAuthContext } from "../context/AuthContext";
import { API } from "../constant";
import { getToken } from "../helpers";

import sortIcon from "../assets/icons/sort_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

const crypto = window.crypto;

const VaultTable = ({ columns, elements, deleteItem }) => {
  const [sortedColumn, setSortedColumn] = useState(columns[0]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading, setUser } = useAuthContext();

  const row2 = elements.map((element, i) => (
    <Table.Tr key={i}>
      {Object.keys(element).map((k) => {
        if (k === "quantity") {
          return (
            <Table.Td key={element[k]}>
              <ItemQuantity item={element} />
            </Table.Td>
          );
        } else if (k === "delete") {
          return (
            <Table.Td key={`delete-${i}`}>
              <Button
                variant="outline"
                color="red"
                fw="500"
                onClick={() => deleteItem(element.item.id)}
              >
                Delete
              </Button>
            </Table.Td>
          );
        } else if (k === "note") {
          return (
            <Table.Td key={crypto.randomUUID()}>
              <TextInput />
            </Table.Td>
          );
        } else if (columns.includes(k)) {
          return (
            <Table.Td key={crypto.randomUUID()}>
              <Group gap="xs">
                <Avatar size="sm" />
                <Text size="sm">{element[k]}</Text>
              </Group>
            </Table.Td>
          );
        }
      })}
    </Table.Tr>
  ));

  const handleSort = (column) => {
    setSortedColumn(column);
  };

  if (isLoading) {
    return "loading...";
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {columns.map((column) => (
            <Table.Th key={column}>
              <UnstyledButton onClick={() => handleSort(column)}>
                <Group>
                  <Text
                    size="xs"
                    tt="capitalize"
                    fw={sortedColumn === column ? 600 : 400}
                  >
                    {column}
                  </Text>
                  {sortedColumn === column ? <Image src={sortIcon} /> : null}
                </Group>
              </UnstyledButton>
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{row2.map((row) => row)}</Table.Tbody>
    </Table>
  );
};

export default VaultTable;
