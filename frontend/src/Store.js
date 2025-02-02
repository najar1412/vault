import { create } from "zustand";

export const useSiteStore = create((set, get) => ({
  selectedOrg: null,
  userVaults: null,
  customModal: null,
  memberOrgs: [],
  ownerOrgs: [],
  notifications: [],
  setRelatedOrgs: (orgs) => set(() => ({ memberOrgs: orgs })),
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
        template: options.template ? options.template : null,
        data: options.data ? options.data : null,
      },
    }),
  setCustomModalContent: (options) => {
    console.log("setting custom content");
    console.log(get().customModal);
    set({
      customModal: {
        ...get().customModal,
        template: options.type,
        data: options.data ? options.data : null,
      },
    });
    get().customModal.open();
    return get().customModal;
  },
}));
