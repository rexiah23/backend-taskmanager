/*
 * All routes for Tasks are defined here
 * Since this file is loaded in server.js into api/data,
 *   these routes are mounted onto /data
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all lists and tasks
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
            content: el.content,
            list_id: el.list_id
          };
          lists[el.list_id].tasks.push(task);
        });
        const response = {lists, listIds}
        res.json({response});
      })
  });

  router.delete("/delete/:id", (request, response) => {
    const deleteType = request.body;
    console.log("DELTE TYPE IS :", deleteType);
    let query = '';

    deleteType === 'task' ?
    query = `DELETE FROM task WHERE id = $1` :
    query = `DELETE FROM list WHERE id = $1`

    db.query(query, [
      request.params.id
    ]).then(() => {
      response.status(204).json({});
    })
    .catch(error => console.log(error));
  });



  // router.post("/orderChange", (req, res) => {
    // const newTask = req.body;
    // const newTaskStringified = JSON.stringify(newTask);
    // const queryValues = [`${newTaskStringified}`, 1];
    // let query = `INSERT INTO dataRows (to_do, user_id)
    // VALUES ($1, $2)`;
    // console.log(query);
    // db.query(query, queryValues)
    //   .then(() => {
    //     res.json({ newTask });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  //   const newChanges = req.body;
  //   const newChangesStringified = JSON.stringify(newChanges);
  //   console.log("res is: ", newChanges);
  //   const queryValues = [`${newChanges}`, 1];
  //   const query = `DROP TABLE`
  // });

  return router;
};

