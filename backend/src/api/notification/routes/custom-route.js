"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/notifications/invite-member",
      handler: "notification.inviteMember",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/notifications/confirm-deal",
      handler: "notification.confirmDeal",
      config: {
        policies: [],
      },
    },
  ],
};
