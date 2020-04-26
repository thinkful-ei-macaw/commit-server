const bcrypt = require('bcryptjs');
const xss = require('xss');

const UserService = {

  /**Gets all users from db 
   */

  getAllUsers(knex) {
    return knex('commit_users').select('*');
  },

  /**Gets first instance of user_name in db
   */

  hasUsername(db, user_name) {
    return db
      .from('commit_users')
      .where({user_name})
      .first()
      .then(user => !!user); // !! = true
  },

  /**Gets all user by its id from db 
   */

  getById(knex, id) {
    return knex('commit_users').select('*').where({id}).first();
  },

  /**Creates a new user to db 
   */

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('commit_users')
      .returning('*')
      .then(rows => rows[0]);
  },

  /**Validates pw length from a user
   */

  validatePassword(password) {
    if(password.length < 8) {
      'Password must be longer than 8 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must be trimmed';
    }
    return null;
  },

  /**Compares string pw with hashed 
   */

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  /**Delete user from db 
   */

  deleteUser(knex, id) {
    return knex('commit_users').where({id}).delete();
  },
  serializeUser(user) { // take users from db, putting it in object, xss is protecting sensitive info
    return {
      id: user.id,
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UserService;