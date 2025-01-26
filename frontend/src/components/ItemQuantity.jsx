import { useState } from "react";

import { NumberInput } from "@mantine/core";

export const ItemQuantity = ({ item }) => {
  const [value, setValue] = useState(item.quantity);

  const handleChange = (val) => {
    // imp api call
    setValue(val);
  };
  return <NumberInput value={value} onChange={(e) => handleChange(e)} />;
};
