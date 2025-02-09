// const { seedUserExists, createSeedUser } = require("./user");
const { doesLocationDataExist, createLocations } = require("./locations");
// const { generateUsersData } = require("./users");
const { clearData } = require("./helpers");
// const { generateEventData } = require("./event");

const generateSeedData = async (strapi) => {
  // const dataExists = await seedUserExists(strapi);

  // seed production data
  const locationDataExists = await doesLocationDataExist(strapi);
  if (!locationDataExists) {
    console.log("**********************");
    console.log("CREATING ITEM DATA");
    console.log("**********************");
    createLocations(strapi);
  }

  // seed development data
  const forceSeeding = process.env.FORCE_SEEDING === "true" ? true : false;

  const skipGeneration = !forceSeeding;

  if (skipGeneration) {
    console.log("skipping seed data generation...");
    return;
  }

  console.log("forcing seed data re-creation...");
  await clearData(strapi);
  console.log("existing data has been cleaned!");

  /* console.log("generating seed data...");

  await Promise.all([createSeedUser(strapi), generateUsersData(strapi)])
    .then(() => generateEventData(strapi))
    .catch((e) => {
      console.error(
        "error during generating seed data! Stopping the application..."
      );
      throw new Error(e);
    }); */

  console.log("generating seed data has been finished successfully!");
};

module.exports = { generateSeedData };
