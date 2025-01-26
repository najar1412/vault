"use strict";

/**
 * vault controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::vault.vault", ({ strapi }) => ({
  async createVault(ctx) {
    // create new vault
    // link vault to user
    const vaultName = ctx.request.body.data.name;
    const newVault = await strapi.entityService.create("api::vault.vault", {
      data: {
        name: vaultName,
      },
    });
    const userId = ctx.request.body.data.userId;
    // update user with vaults
    /* 
    const getUser = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId
    ); */

    const updateUser = await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {
        data: {
          vaults: {
            connect: [newVault.documentId],
          },
        },
      }
    );

    const getUser = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      updateUser.id,
      { populate: "vaults" }
    );
    const result = {
      user: getUser,
      newVault: newVault,
    };
    return result;

    // remove subscripted events from event
    /* const entries = await strapi.entityService.findMany(
          "api::subscribed-event.subscribed-event",
          {
            filters: {
              $and: [
                { user: ctx.request.body.data.id },
                { event: ctx.request.body.data.eventId },
              ],
            },
          }
        );
  
        entries.map((e) =>
          strapi.entityService.delete(
            "api::subscribed-event.subscribed-event",
            e.id
          )
        ); */

    /*  // remove user from winning_users
        const updateEvent = await strapi.entityService.update(
          "api::event.event",
          ctx.request.body.data.eventId,
          {
            data: {
              winning_users: {
                disconnect: ctx.request.body.data.id,
              },
            },
          }
        ); */

    /* // update users rating
        if (updateEvent.winning_datetime) {
          const getUser = await strapi.entityService.findOne(
            "plugin::users-permissions.user",
            ctx.request.body.data.id
          );
  
          await strapi.entityService.update(
            "plugin::users-permissions.user",
            ctx.request.body.data.id,
            {
              data: {
                rating: getUser.rating - 100,
              },
            }
          );
        } */
  },
  async createVaultForOrg(ctx) {
    // create new vault
    // link vault to user
    const vaultName = ctx.request.body.data.name;
    const newVault = await strapi.entityService.create("api::vault.vault", {
      data: {
        name: vaultName,
      },
    });
    const orgId = ctx.request.body.data.orgId;
    // update user with vaults
    /* 
    const getUser = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      orgId
    ); */

    const updateOrg = await strapi.entityService.update(
      "api::organisation.organisation",
      orgId,
      {
        data: {
          vaults: {
            connect: [newVault.documentId],
          },
        },
      }
    );

    const getOrganisation = await strapi.entityService.findOne(
      "api::organisation.organisation",
      updateOrg.id,
      { populate: "vaults" }
    );
    const result = {
      organisation: getOrganisation,
      newVault: newVault,
    };
    return result;
  },
}));
