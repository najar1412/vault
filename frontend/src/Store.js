import { create } from "zustand";

export const useSiteStore = create((set, get) => ({
  selectedOrg: null,
  userVaults: null,
  customModal: null,
  memberOrgs: [],
  ownerOrgs: [],
  notifications: [],
  setMemberOrgs: (orgs) => set(() => ({ memberOrgs: orgs })),
  setNotifications: (notifications) =>
    set(() => ({ notifications: notifications })),
  setOwnerOrgs: (orgs) => set(() => ({ ownerOrgs: orgs })),
  setSelectedOrg: (org) => set(() => ({ selectedOrg: org })),
  setUserVaults: (vaults) => set(() => ({ userVaults: vaults })),
  removeAllBears: () => set({ bears: 0 }),
  setCustomModal: (options) =>
    set({
      customModal: {
        opened: options.opened,
        open: options.open,
        close: options.close,
        content: options.content ? options.content : null,
      },
    }),
  setCustomModalContent: (name) => {
    set({ customModal: { ...get().customModal, content: name } });
    get().customModal.open();
    return console.log(get().customModal);
  },
}));
