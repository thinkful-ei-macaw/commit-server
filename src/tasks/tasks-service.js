const TaskService = {
  getAllTasks(knex, user_id) {
    return knex
      .select('*')
      .from('commit_tasks')
      .where({user_id});
  },

  getTaskByID(knex, id) {
    return knex
      .from('commit_tasks')
      .select('*')
      .where('id', id)
      .first();
  }, 

  deleteTask(knex, id) {
    return knex
      .from('commit_tasks')
      .where({ id })
      .delete();
  },

  insertTask(knex, newTask) {
    return knex
      .insert(newTask)
      .into('commit_tasks')
      .returning('*')
      .then(rows => rows[0]);
  },

  updateTask(knex, newTask, id) {
    return knex('commit_tasks').where({
      id
    }).update(newTask);
  },
  deleteAllTasks(knex, id) {
    return knex
      .from('commit_tasks')
      .where({ user_id: id })
      .delete();
  }
};



module.exports = TaskService;