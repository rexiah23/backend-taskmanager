const e = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all tasks and lists
  router.get("/all", (request, response) => {
    let query = `SELECT list.id as list_id, list.title as list_title, task.id as task_id, task.content as task_content FROM list LEFT JOIN task ON (task.list_id = list.id)`;
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



  // let newListId = '';
  // //If there are no lists saved in database, set newListId as 'list-1'
  // if (!result.rows[0]) {
  //   newListId = 'list-1';
  // } else {
  //   const latestListId = result.rows[0].id;
  //   newListId = `list-${parseInt(latestListId[latestListId.length-1]) + 1}`;
  // }
  // const secondQuery = `INSERT INTO list(id, title) VALUES ($1, $2)`;
  // const args = [newListId, title];
  router.post("/add", (request, response) => {
    const { title:content, listId } = request.body;
    const firstQuery = `SELECT * FROM task ORDER BY id DESC LIMIT 1;`;
    db.query(firstQuery)
    .then((result) => {
      let newTaskId = '';
      //If there are no tasks saved in database, set newTasId as 'task-1'
      if (!result.rows[0]) {
        newTaskId = 'task-1';
      } else {
        const latestTaskId = result.rows[0].id;
        newTaskId = `task-${parseInt(latestTaskId[latestTaskId.length-1]) + 1}`;
      }
      const secondQuery = `INSERT INTO task(id, content, list_id) VALUES ($1, $2, $3)`;
      const args = [newTaskId, content, listId];
      db.query(secondQuery, args)
      .then(() => {
        db.query(firstQuery)
        .then(result => {
          const insertedTaskValue = result.rows[0];
          response.json({insertedTaskValue})
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
  });


  router.delete("/delete/:id", (request, response) => {
    const query = `DELETE FROM task WHERE id = $1`
    db.query(query, [
      request.params.id
    ]).then(() => {
      response.status(204).json({});
    })
    .catch(error => console.log(error));
  });

  return router;
};

