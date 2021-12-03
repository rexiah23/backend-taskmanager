/*
 * All routes for Tasks are defined here
 * Since this file is loaded in server.js into api/data,
 *   these routes are mounted onto /data
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM list JOIN task ON (task.list_id = list.id)`;
    console.log(query);
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
            content: el.content
          };
          lists[el.list_id].tasks.push(task);
        });

        const response = {lists, listIds}
        res.json({response, dataRows});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // router.post("/new", (req, res) => {
  //   const newTask = req.body;
  //   const newTaskStringified = JSON.stringify(newTask);
  //   const queryValues = [`${newTaskStringified}`, 1];
  //   let query = `INSERT INTO dataRows (to_do, user_id)
  //   VALUES ($1, $2)`;
  //   console.log(query);
  //   db.query(query, queryValues)
  //     .then(() => {
  //       res.json({ newTask });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });
  return router;
};

