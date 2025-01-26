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
  ],
};
