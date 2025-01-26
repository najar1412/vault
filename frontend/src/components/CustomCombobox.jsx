import { useEffect, useState } from "react";
import { Input, InputBase, Combobox, useCombobox } from "@mantine/core";

export const CustomCombobox = ({ data, selected }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState("");

  const options = data.map((item) => (
    <Combobox.Option value={item.name} key={item.name}>
      {item.name}
    </Combobox.Option>
  ));

  useEffect(() => {
    if (data) {
      setValue(data[0].name);
      selected(data[0].name);
    }
  }, []);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        selected(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          w={"100%"}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
