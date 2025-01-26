import { useState } from "react";

import { TextInput, Combobox, useCombobox } from "@mantine/core";

import { rewards } from "../data/data";

const RewardRow = ({ character, appendCalculate }) => {
  const combobox = useCombobox();
  const [value, setValue] = useState("");
  const shouldFilterOptions = !rewards.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? rewards.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase().trim())
      )
    : rewards;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        appendCalculate(character, "ship", optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          placeholder="Select reward"
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default RewardRow;
