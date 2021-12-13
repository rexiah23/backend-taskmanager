#DEPLOYED PROJECT LINK: https://taskmanager-lewislee.netlify.app/

#Backend repo for [task-manager project](https://github.com/rexiah23/task-manager)
> Project by [Lewis Lee](https://github.com/rexiah23)

## BACKEND SETUP

(If needed install [Postgres](https://www.postgresql.org/))

###Database Setup: 
In the terminal, run these commands: 
1. `psql`
2. `CREATE ROLE trello LOGIN SUPERUSER PASSWORD 'trello';`
3. `\q`
4. `CREATE DATABASE trello;`
5. `\q`

To start the backend:
1. Open terminal at the root backend repo (backend @ 31e5410).
2. Install dependencies with `npm install`.
3. Run this command to reset the database: `npm run db:reset`
4. Run this command to start the server: `npm start`
