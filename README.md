## strapi

local dev login creds

dev@dev.com
devDev1!

## prod

cp `.env.example` `.env` and fill out

build apps

use `ecosystem.config.cjs` files for pm2 management on prod

`pm2 start ecosystem.config.cjs`

## TODO

prepare for users

- **_fix local strapi admin acccess_**
- user flow
  - create org does not update user -> forward to org page
  - basic user feed back (mantine tool tips, not working etc)
  - clean up add member flow (updating ui, redirects mostly), remove member flow
- move loading to state
- Vaults
  - allow editing of items in the table (quanity, note etc)
  - enable search of vault items
  - dont know the difference difference (visually or programically) between org and personal vault?
- Orgs
  - if no organisation, redirect user to profile
  - on leave/join org, refresh ui, redirect
  - delete org
- admin/member page views (show crud etc)
- database seeding / need starter items
- change delete member icon to something like exit it?
- analytics?

- better item schema, needs to include ship comps, weap sizes, commodidies and scu sizes?
