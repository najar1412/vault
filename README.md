## strapi

local dev login creds

dev@dev.com
devDev1!

## prod

cp `.env.example` `.env` and fill out

build apps

use `ecosystem.config.cjs` files for pm2 management on prod

```pm2 start ecosystem.config.cjs```

## TODO

prepare for users

- user flow
- remove loading to state
- Vaults
  - allow editing of items in the table (quanity, note etc)
  - enable search of vault items
  - dont know the difference difference (visually or programically) between org and personal vault?
- Orgs
  - if no organisation, redirect user to profile
  - on leave/join org, refresh ui, redirect
