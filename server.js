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
// const db = new Pool({
//   user:'qsoaremuliztwy',
//   password: 'e8aad69764cb60f18364ea146395d411157ad13ba4ab59427e439fc63bfb5b67',
//   database:'d8c06tvbob3n35',
//   host: 'ec2-44-195-14-127.compute-1.amazonaws.com',
//   port: '5432',
//   ssl: { rejectUnauthorized: false }
// });
// db.connect();

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
const listRoutes = require("./routes/list");
const taskRoutes = require("./routes/task");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/list", listRoutes(db));
app.use("/api/task", taskRoutes(db));

// Note: mount other resources here, using the same pattern above

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
