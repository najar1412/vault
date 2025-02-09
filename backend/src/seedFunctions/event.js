const { faker } = require("@faker-js/faker");

const { randomElementFromArray, randomIntFromInterval } = require("./helpers");

// TODO: when generating subscribed-events, the event creator shouldnt be included.
// TODO: make sure generated users can only subscribed once (mutiple subscripts, but only once...)

const generateEventData = async (strapi) => {
  console.log("generating events");

  const { DEV_SEED_DATA_EVENTS } = process.env;
  const eventsSize = DEV_SEED_DATA_EVENTS ? parseInt(DEV_SEED_DATA_EVENTS) : 5;
  const maxAvailableDates = 10;

  await strapi.entityService
    .findMany("plugin::users-permissions.user", {
      filters: {
        username: {
          $startsWith: "test",
        },
      },
    })
    .then((response) => {
      const newUsers = response;
      // generate event expiry dates
      for (let i = 0; i < eventsSize; i++) {
        const expiryDate = faker.date.between({
          from: faker.date.recent({ days: 15 }),
          to: faker.date.soon({ days: 10 }),
        });

        // generate event available dates
        const currentAvailabilities = randomAvailableDates(
          maxAvailableDates,
          expiryDate
        );
        // create events
        const eventUser = randomElementFromArray(newUsers);
        strapi.entityService
          .create("api::event.event", {
            data: {
              name: faker.word.words({ count: { min: 3, max: 6 } }),
              max_number: randomIntFromInterval(1, 6),
              cancelled: Math.random() < 0.2 ? Date.now() : null,
              available_dates: currentAvailabilities,
              expiry: expiryDate,
              address: faker.location.streetAddress(),
              address2: Math.random() >= 0.5 ? faker.location.street() : "",
              towncity: faker.location.city(),
              country: faker.location.country(),
              user: eventUser.id,
              organiser_rating: eventUser.rating,
            },
          })
          .then((event) => {
            let remainingSubscriptionUsers = JSON.parse(
              JSON.stringify(newUsers)
            );
            remainingSubscriptionUsers = remainingSubscriptionUsers.filter(
              (user) => user.id !== eventUser.id
            );
            // create usbscriptions to events
            const numOfSubscriptions = randomIntFromInterval(0, 6);
            for (let i = 0; i < numOfSubscriptions; i++) {
              const subscriptionUser = randomElementFromArray(
                remainingSubscriptionUsers
              ).id;
              remainingSubscriptionUsers = remainingSubscriptionUsers.filter(
                (user) => user.id !== subscriptionUser
              );
              strapi.entityService.create(
                "api::subscribed-event.subscribed-event",
                {
                  data: {
                    avaliable: [randomElementFromArray(currentAvailabilities)],
                    user: subscriptionUser,
                    event: event.id,
                  },
                }
              );
            }
          });
      }
    });
};

const randomAvailableDates = (maxAvailableDates, noEarlierThan) => {
  const noLaterThan = new Date(noEarlierThan);
  let day = noLaterThan.getDate() + 12;
  noLaterThan.setDate(day);

  const dates = [];
  const amount = randomIntFromInterval(1, maxAvailableDates);
  for (let i = 0; i < amount; i++) {
    dates.push({
      available: faker.date.between({ from: noEarlierThan, to: noLaterThan }),
    });
  }

  return dates;
};

module.exports = { generateEventData };
