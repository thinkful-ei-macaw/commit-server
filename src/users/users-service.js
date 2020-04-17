const bcrypt = require('bcryptjs');
const xss = require('xss');

const UserService = {
  hasUsername(knex, user_name) {
    return knex
      .from('commit_users')
      .where({user_name})
      .first()
      .then(user => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('commit_users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if(password.length < 8) {
      'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith('')) {
      return 'Password be less than 72 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    return null;
  },

  hasPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      nickname: xss(user.nick_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UserService;