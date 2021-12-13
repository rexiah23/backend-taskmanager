const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (request, response) => {
    const query = `SELECT url FROM background`;
    db.query(query)
    .then(result => {
      const url = result.rows[0]
      response.json({url})
    })
    .catch(error => console.log(error));
  })

  router.put("/", (request, response) => {
    const { backgroundUrl } = request.body;
    const query = `UPDATE background SET url = $1 WHERE id = 1`;
    const args = [backgroundUrl];
    db.query(query, args)
    .then(() => {
      response.status(204).json({})
    })
    .catch(error => console.log(error));
  })

  return router;
};

