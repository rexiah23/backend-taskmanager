const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all tasks and lists
  router.get("/all", (req, res) => {
    let query = `SELECT list.id as list_id, list.title as list_title, task.id as task_id, task.content as task_content FROM list LEFT JOIN task ON (task.list_id = list.id)`;
    console.log(query);
    db.query(query)
      .then(data => {
        const dataRows = data.rows;
        const listIds = [];
        const lists = {};
        console.log("DATA ROWS IS: ", dataRows);
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
        const response = {lists, listIds}
        res.json({response});
      })
  });

  router.post("/add", (request, response) => {
    // const { title, listId } = request.body.item;
    // console.log("Add is:", request.body.item);
    // db.query('SELECT * FROM task ORDER BY id DESC LIMIT 1;')

    // let query = '';
    // let args = [];
    // if (type === 'task') {
    //   query = `INSERT INTO task (id, content, list_id) VALUES ($1, $2, $3)`;
      // const newTaskId = `list-${parseInt(listId[listId.length-1]) + 1}`;
    //   args = [title, type, listId]
    // } else {
    //   query = `INSERT INTO list (id, title) VALUES ($1, $2)`
    //   const newListId = `list-${parseInt(listId[listId.length-1]) + 1}`;
    //   args = [newListId, title]
    // }
    // type === 'task' ?
    // query = `INSERT INTO list (id, title) VALUES ($1, $2)`


    // const newListId = `list-${parseInt(listId[listId.length-1]) + 1}`;
    // console.log("NEW LIST ID", newListId);
    // const args = [title, type, newListId];
    // db.query(query, args)
    // .then(() => {
    //   response.status(204).json({});
    // })
    // .catch(error => console.log(error));
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

