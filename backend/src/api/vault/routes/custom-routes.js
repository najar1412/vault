"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/vaults/createVault",
      handler: "vault.createVault",
      config: {
        policies: [],
      },
    },
    {
        method: "POST",
        path: "/vaults/createVaultForOrg",
        handler: "vault.createVaultForOrg",
        config: {
          policies: [],
        },
      },
  ],
};
