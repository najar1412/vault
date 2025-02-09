const { randomIntFromInterval } = require("./helpers");
const locationData = require("./data/locations/countries+states.json");

const USERNAME_BASE = "test";

/**
 * Using Users collection as main indicator if we have generated seed data before
 */

/**
 * Creating user that will be an indicator for method `seedUserExists`
 *
 * cannot be used for login, such as lacks full functionality with JWT
 * for more info how to create valid user via API, checkout the source-code:
 * https://github.com/strapi/strapi/blob/master/packages/plugins/users-permissions/server/controllers/auth.js#L239
 */
const generateUsersData = async (strapi) => {
  console.log("generating users");
  const now = Date.now();
  const { DEV_SEED_DATA_USERS } = process.env;
  const userCount = DEV_SEED_DATA_USERS ? parseInt(DEV_SEED_DATA_USERS) : 10;

  const bulkTodoPromises = [];
  const randomTodosData = new Array(userCount)
    .fill(null)
    .map((_, index) => _randomTodo(index));

  for (const randomTodoData of randomTodosData) {
    const randomTodoPromise = strapi.entityService.create(
      "plugin::users-permissions.user",
      {
        data: {
          ...randomTodoData,
        },
      }
    );
    bulkTodoPromises.push(randomTodoPromise);
  }

  await Promise.all(bulkTodoPromises);
};

const _randomTodo = (index) => {
  return {
    username: `${USERNAME_BASE}${index}`,
    password: `${USERNAME_BASE}${index}${USERNAME_BASE}${index}`,
    email: `${USERNAME_BASE}${index}@${USERNAME_BASE}${index}.com`,
    confirmed: true,
    provider: "local",
    role: 1,
    rating: randomIntFromInterval(100, 2000),
    country: randomIntFromInterval(2, locationData.length) - 2,
  };
};

module.exports = { generateUsersData };
