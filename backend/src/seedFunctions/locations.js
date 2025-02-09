// import locationData from "./data/locations/countries+states.json";
// const locationData = require("./data/locations/countries+states.json");
const itemData = require("./data/locations/items.json");

/**
 * Using Users collection as main indicator if we have generated seed data before
 */
const doesLocationDataExist = async (strapi) => {
  const [countries] = await strapi.entityService.findMany("api::item.item", {
    where: {
      id: {
        $notNull: true,
      },
    },
  });
  return !!countries;
};

/**
 * Creating user that will be an indicator for method `seedUserExists`
 *
 * cannot be used for login, such as lacks full functionality with JWT
 * for more info how to create valid user via API, checkout the source-code:
 * https://github.com/strapi/strapi/blob/master/packages/plugins/users-permissions/server/controllers/auth.js#L239
 */
const createLocations = async (strapi) => {
  await itemData.map((item) =>
    strapi.entityService.create("api::item.item", {
      data: {
        name: item.name,
        size: item.size,
        grade: item.grade,
        class: item.class,
        type: item.type,
        category: item.category,
      },
    })
  );
  /* await strapi.entityService.create("plugin::users-permissions.user", {
    data: {
      username: SEED_USERNAME,
      password: `${SEED_USERNAME}${SEED_USERNAME}`,
      email: `${SEED_USERNAME}@${SEED_USERNAME}.com`,
      confirmed: true,
      provider: "local",
      role: 1,
    },
  }); */
};

module.exports = { createLocations, doesLocationDataExist };
