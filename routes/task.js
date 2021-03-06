const e = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all tasks and lists
  router.get("/all", (request, response) => {
    let query = `SELECT list.id as list_id, list.title as list_title, task.id as task_id, task.content as task_content FROM list LEFT JOIN task ON (task.list_id = list.id) ORDER BY list.id`;
    db.query(query)
      .then(data => {
        const dataRows = data.rows;
        const listIds = [];
        const lists = {};
        dataRows.forEach(el => {
          const listId = el.list_id;
          const listTitle = el.list_title;
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
          if (!el.task_id) return;
          const task = {
            id: el.task_id,
            content: el.task_content,
            list_id: el.list_id
          };
          lists[el.list_id].tasks.push(task);
        });
        const refactoredData = {lists, listIds}
        response.json({refactoredData});
      })
  });

  router.post("/add", (request, response) => {
    const { title:content, listId } = request.body;
    const query = 'INSERT INTO task(content, list_id) VALUES ($1, $2) RETURNING id';
    const args = [content, listId];
    db.query(query, args)
    .then((result) => {
      //Need to send this back to save in client side state
      const insertedId = result.rows[0].id;
      response.json({insertedId})
    })
    .catch(error => console.log(error));
  });

  router.put("/change-list-container", (request, response) => {
    const { newListId, taskId } = request.body;
    const query = `UPDATE task SET list_id = $1 WHERE id = $2`;
    const args = [newListId, taskId];
    db.query(query, args)
    .then((result) => {
      response.status(204).json({})
    })
    .catch(error => console.log(error));
  })

  router.delete("/delete/:id", (request, response) => {
    const query = `DELETE FROM task WHERE id = $1`;
    db.query(query, [
      request.params.id
    ]).then(() => {
      response.status(204).json({});
    })
    .catch(error => console.log(error));
  });

  return router;
};



