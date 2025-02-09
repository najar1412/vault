## strapi

local dev login creds

dev@dev.com
devDev1!

## prod

#### backend:

1. fill out config

cp `.env.example` `.env` and fill out

2. set `url` for admin panel (comment out for dev)

`/backend/config/server.js`

3. build app

use `ecosystem.config.cjs` files for pm2 management on prod

`pm2 start ecosystem.config.cjs`

#### frontend:

1. build app

`npm run build`

use `ecosystem.config.cjs` files for pm2 management on prod

`pm2 start ecosystem.config.cjs`

## TODO

prepare for users

- user flow
  - basic user feed back (mantine tool tips, not working etc)
  - clean up add member flow (updating ui, redirects mostly), remove member flow
- Vaults
  - allow editing of items in the table (quanity, note etc)
  - enable search of vault items
  - dont know the difference difference (visually or programically) between org and personal vault?
- Orgs
  - if no organisation, redirect user to profile
- analytics?

- better item schema for commodidies and scu sizes?
