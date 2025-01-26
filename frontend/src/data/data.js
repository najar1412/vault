// data
const characters = [
  {
    name: "kotchy",
    points: 3,
  },
  {
    name: "cydus",
    points: 5,
  },
  {
    name: "dual-drone",
    points: 1,
  },
];

const locations = [
  {
    name: "checkmate",
  },
  {
    name: "orbituary",
  },
  {
    name: "ruin",
  },
];

const items = [
  {
    label: "red",
    quantity: 2,
    character: characters[0].name,
    location: locations[0].name,
  },
  {
    label: "blue",
    quantity: 5,
    character: characters[0].name,
    location: locations[2].name,
  },
  {
    label: "comp board 1",
    quantity: 4,
    character: characters[0].name,
    location: locations[1].name,
  },
];

const rewards = ["ship 1", "ship 2", "ship 3"];

export { characters, locations, items, rewards };
