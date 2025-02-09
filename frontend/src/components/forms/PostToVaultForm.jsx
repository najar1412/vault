import { useEffect, useState } from "react";

import { Button, Group, Autocomplete, NumberInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useSiteStore } from "@/Store";
import { API } from "@/constant";
import { getToken } from "@/helpers";

export const PostToVaultForm = ({ post }) => {
  const { setIsLoading } = useSiteStore();
  const [items, setItems] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      item: "",
      quantity: 1,
    },
  });

  const handlePost = (values) => {
    const fullItem = items.data.filter((item) => item.name === values.item)[0];
    values.item = fullItem;
    post(values);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/items`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      setItems(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <form onSubmit={form.onSubmit((values) => handlePost(values))}>
      {items ? (
        <Stack>
          <Group wrap="no-wrap">
            <Autocomplete
              key={form.key("item")}
              {...form.getInputProps("item")}
              label="Item"
              data={items ? items.data.map((item) => item.name) : []}
              placeholder="select item"
            />
            <NumberInput
              key={form.key("quantity")}
              {...form.getInputProps("quantity")}
              label="Quantity"
              min={1}
            />
          </Group>

          <Button type="submit" color="black" fw="400">
            Add
          </Button>
        </Stack>
      ) : null}
    </form>
  );
};
