// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const dataRoutes = require("./routes/data");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/data", dataRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.json({
    hello:'123'
  })
});

app.post("/", (req, res) => {
  console.log("RESPONSEEE:", req.body);
});

// app.get("/api/data", (req, res) => {
//   let query = `SELECT * FROM list JOIN task ON (task.list_id = list.id)`;
//   console.log(query);
//   db.query(query)
//     .then(data => {
//       const dataRows = data.rows;
//       const listIds = [];
//       const lists = {};

//       dataRows.forEach(el => {
//         const listId = el.list_id;
//         const listTitle = el.title;
//         if (!listIds.includes(listId)) {
//           listIds.push(listId);
//         };

//         lists[listId] = {
//           id: listId,
//           title: listTitle,
//           tasks: []
//         };
//       });
//       dataRows.forEach(el => {
//         const task = {
//           id: el.id,
//           content: el.content,
//           list_id: el.list_id
//         };
//         lists[el.list_id].tasks.push(task);
//       });
//       const response = {lists, listIds}
//       res.json({response});
//     })
// });

// app.delete("/api/data/change/:id", (request, response) => {
//   const deleteType = request.body;
//   console.log("DELTE TYPE IS :", deleteType);
//   db.query(`DELETE FROM task WHERE id = $1`, [
//     request.params.id
//   ]).then(() => {
//     response.status(204).json({});
//   })
//   .catch(error => console.log(error));
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
