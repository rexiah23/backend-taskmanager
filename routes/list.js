const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {

  router.post("/add", (request, response) => {
    const { title } = request.body;
    const query = 'INSERT INTO list(title) VALUES ($1) RETURNING id';
    const args = [title];
    db.query(query, args)
    .then((result) => {
      //Need to send this back to save in client side state
      const insertedId = result.rows[0].id;
      response.json({insertedId})
    })
    .catch(error => console.log(error));
  });

  router.put("/update-title", (request, response) => {
    const { newTitle, listId } = request.body;
    const query = `UPDATE list SET title = $1 WHERE id = $2`;
    const args = [newTitle, listId];
    db.query(query, args)
    .then(() => {
      response.status(204).json({})
    })
    .catch(error => console.log(error));
  })

  router.delete("/delete/:id", (request, response) => {
    let query = 'DELETE FROM list WHERE id = $1';
    console.log('request Params Id: ', request.params.id);
    db.query(query, [
      request.params.id
    ]).then(() => {
      response.status(204).json({});
    })
    .catch(error => console.log(error));
  });

  return router;
};

