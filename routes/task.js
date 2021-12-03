const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

module.exports = (db) => {
  //get all tasks and lists
  router.get("/all", (req, res) => {
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

  router.post("/add", (request, response) => {
    // const { title, type, listId } = request.body.item;
    // console.log("Add is:", request.body.item);
    // let query = '';
    // let args = [];
    // if (type === 'task') {
    //   query = `INSERT INTO task (id, content, list_id) VALUES ($1, $2, $3)`;
    //   const newTaskId = `list-${parseInt(listId[listId.length-1]) + 1}`;
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

