const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all lists and tasks
  router.get("/", (request, response) => {
    let query = `SELECT * FROM list JOIN task ON (task.list_id = list.id)`;
    db.query(query)
      .then(data => {
        const dataRows = data.rows;
        const listIds = [];
        const lists = {};

        dataRows.forEach(el => {
          const listId = el.list_id;
          const listTitle = el.title;
          if (!listIds.includes(listId)) {
            listIds.push(listId);
          };

          lists[listId] = {
            id: listId,
            title: listTitle,
            tasks: []
          };
        });

        dataRows.forEach(el => {
          const task = {
            id: el.id,
            content: el.content,
            list_id: el.list_id
          };
          lists[el.list_id].tasks.push(task);
        });
        const refactoredData = {lists, listIds}
        response.json({refactoredData});
      })
  });

  router.post("/add", (request, response) => {
    const { title } = request.body;
    const firstQuery = `SELECT * FROM list ORDER BY id DESC LIMIT 1;`;
    db.query(firstQuery)
    .then((result) => {
      const latestListId = result.rows[0].id;
      const newListId = `list-${parseInt(latestListId[latestListId.length-1]) + 1}`;
      const secondQuery = `INSERT INTO list(id, title) VALUES ($1, $2)`;
      const args = [newListId, title];
      db.query(secondQuery, args)
      .then(() => {
        db.query(firstQuery)
        .then(result => {
          const insertedListValue = result.rows[0];
          response.json({insertedListValue})
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
  });

  router.delete("/delete/:id", (request, response) => {
    let query = 'DELETE FROM list WHERE id = $1';

    db.query(query, [
      request.params.id
    ]).then(() => {
      response.status(204).json({});
    })
    .catch(error => console.log(error));
  });

  return router;
};

