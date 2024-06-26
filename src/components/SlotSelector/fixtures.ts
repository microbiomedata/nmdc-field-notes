const slots = Array.from({ length: 9 }, (_, i) => ({
  name: `slot${i + 1}`,
  title: `Slot ${i + 1}`,
  rank: i + 1,
  description: `Description for slot ${i + 1}`,
}));

export const slotGroups = [
  {
    name: "group1",
    title: "Group 1",
    rank: 1,
    slots: slots.slice(0, 3),
  },
  {
    name: "group2",
    title: "Group 2",
    slots: slots.slice(3, 6),
  },
  {
    name: "group3",
    title: "Group 3",
    rank: 2,
    slots: slots.slice(6, 9),
  },
];
