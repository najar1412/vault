// import { statSync } from 'fs'
const { statSync } = require("fs");

const randomBoolean = () => Math.random() < 0.5;

const randomElementFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const ensureSQLite = (strapi) => {
  console.log("verifying db as local SQLite");
  const db = strapi.db; // from debugging

  if (db.config.connection.client !== "sqlite") {
    throw new Error(
      "strapi is NOT using local SQLite! Please, verify usage of SQLite before clearing data"
    );
  }
};

const clearData = async (strapi) => {
  ensureSQLite(strapi);

  const collectionTypeUids = [
    "api::item.item",
    "api::notification.notification",
    "api::organisation.organisation",
    "api::vault.vault",
    "plugin::users-permissions.user",
  ];
  const bulkClears = [];

  for (const collectionTypeUid of collectionTypeUids) {
    const collectionClear = strapi.query(collectionTypeUid).deleteMany({
      where: {
        id: {
          $notNull: true,
        },
      },
    });

    bulkClears.push(collectionClear);
  }

  await Promise.all(bulkClears);
};

const uploadFile = async (strapi, { data, file }) => {
  const { refId, ref, field } = data;
  const { name, path, type } = file;

  const fileStat = statSync(path);

  const [uploadedFile] = await strapi.plugins.upload.services.upload.upload({
    data: {
      refId,
      ref,
      field,
    },
    files: {
      path,
      name,
      type,
      size: fileStat.size,
    },
  });

  return uploadedFile;
};

module.exports = {
  randomBoolean,
  clearData,
  uploadFile,
  randomElementFromArray,
  randomIntFromInterval,
};
