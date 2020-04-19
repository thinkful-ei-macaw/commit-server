const bcrypt = require('bcryptjs');
const xss = require('xss');

const UserService = {
  hasUsername(db, user_name) {
    return db
      .from('commit_users')
      .where({user_name})
      .first()
      .then(user => !!user); // !! = true
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('commit_users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if(password.length < 8) {
      'Password must be longer than 8 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must be trimmed';
    }

    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
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