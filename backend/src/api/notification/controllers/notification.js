"use strict";

/**
 * notification controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::notification.notification",
  ({ strapi }) => ({
    async inviteMember(ctx) {
      const collect = {
        type: ctx.request.body.data.type,
        requiresConfirmation: ctx.request.body.data.requiresConfirmation,
        senderRelation: ctx.request.body.data.senderRelation,
        senderId: ctx.request.body.data.senderId,
        receiverRelation: ctx.request.body.data.receiverRelation,
        receiverUsername: ctx.request.body.data.receiverUsername,
      };
      // confirm user
      const userExists = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            username: {
              $startsWith: collect.receiverUsername,
            },
          },
        });

      if (userExists) {
        // make notification
        collect.receiverId = userExists.documentId;
        const newNotificaiton = await strapi.entityService.create(
          "api::notification.notification",
          {
            data: collect,
          }
        );
        return newNotificaiton;
      } else {
        console.log("no such user");
      }

      return null;
    },
  })
);
