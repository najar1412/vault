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
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { v4 as uuidv4 } from "uuid";

import { ItemQuantity } from "./ItemQuantity";

import sortIcon from "@/assets/icons/sort_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import componentIcon from "@/assets/icons/bottom_app_bar_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import armorIcon from "@/assets/icons/local_police_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import bentoIcon from "@/assets/icons/bento_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import accountTreeIcon from "@/assets/icons/account_tree_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import usbIcon from "@/assets/icons/usb_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "@/assets/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import saveIcon from "@/assets/icons/save_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

const crypto = () => uuidv4();

// TODO: get from db
const ITEM_TYPES = {
  general: { icon: bentoIcon },
  ship_component: { icon: componentIcon },
  ship_weapon: { icon: accountTreeIcon },
  fps_weapon: { icon: usbIcon },
  fps_armor: { icon: armorIcon },
};

const VaultTable = ({ columns, elements, deleteItem, saveItem, canEdit }) => {
  const [sortedColumn, setSortedColumn] = useState(columns[0]);

  const FormUpdateItem = ({ element, id }) => {
    const form = useForm({
      mode: "uncontrolled",
      initialValues: {
        note: "",
        itemId: element.item.id,
      },

      validate: {
        // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      },
    });

    const handleItemUpdate = (values) => {
      saveItem({ itemId: values.itemId, note: values.note });
    };

    return (
      <form onSubmit={form.onSubmit((values) => handleItemUpdate(values))}>
        <Group wrap="no-wrap" gap={0} align="center">
          <TextInput
            placeholder={element[id]}
            key={form.key("note")}
            // value={element[id]}
            {...form.getInputProps("note")}
          />
          <Button type="submit" color="lightgray" variant="outline">
            <Image src={saveIcon} />
          </Button>
        </Group>
      </form>
    );
  };

  const row2 = elements.map((element, i) => (
    <Table.Tr key={i}>
      {Object.keys(element).map((k) => {
        if (k === "quantity") {
          return (
            <Table.Td key={element[k]}>
              {canEdit ? (
                <ItemQuantity item={element} />
              ) : (
                <Text size="xs">{element.item.quantity}</Text>
              )}
            </Table.Td>
          );
        } else if (k === "delete") {
          return canEdit ? (
            <Table.Td key={`delete-${i}`}>
              <UnstyledButton onClick={() => deleteItem(element.item.id)}>
                <Image src={deleteIcon} />
              </UnstyledButton>
            </Table.Td>
          ) : null;
        } else if (k === "note") {
          return (
            <Table.Td key={crypto()}>
              {canEdit ? (
                <FormUpdateItem element={element} id={k} />
              ) : (
                <Text size="xs">{k}</Text>
              )}
            </Table.Td>
          );
        } else if (columns.includes(k)) {
          return (
            <Table.Td key={crypto()}>
              <Group gap="xs">
                <Avatar
                  src={ITEM_TYPES[element.item.item.type].icon}
                  size="sm"
                />
                <Stack gap={0}>
                  <Group>
                    <Text size="sm" fw={500}>
                      {element[k]}
                    </Text>
                    <Text size="xs" opacity={0.5}>
                      {element.item.item.type}
                    </Text>
                  </Group>

                  <Group>
                    {element.item.item.category ? (
                      <Text size="xs" ta="center" tt="uppercase">
                        {element.item.item.category
                          ? element.item.item.category
                          : " "}
                      </Text>
                    ) : null}
                    {element.item.item.size ? (
                      <Text size="xs" ta="center">
                        {element.item.item.size ? element.item.item.size : " "}
                      </Text>
                    ) : null}
                    {element.item.item.grade ? (
                      <Text size="xs" ta="center" tt="uppercase">
                        {element.item.item.grade
                          ? element.item.item.grade
                          : " "}
                      </Text>
                    ) : null}

                    {element.item.item.class ? (
                      <Text size="xs" ta="center" tt="uppercase">
                        {element.item.item.class
                          ? element.item.item.class
                          : " "}
                      </Text>
                    ) : null}
                  </Group>
                </Stack>
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
