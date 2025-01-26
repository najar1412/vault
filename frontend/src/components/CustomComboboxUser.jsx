import { useState } from "react";
import { Input, InputBase, Combobox, useCombobox } from "@mantine/core";

export const CustomComboboxUser = ({ data, selected }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState("");

  const options = data
    ? data.map((item) => (
        <Combobox.Option value={item.username} key={item.username}>
          {item.username}
        </Combobox.Option>
      ))
    : null;

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
        <Combobox.Options>{data ? options : null}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
