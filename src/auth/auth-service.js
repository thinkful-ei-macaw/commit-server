const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');



const AuthService = {

  getUserWithUserName(db, user_name) { // method responsible for getting first instance of user_name
    return db('commit_users')
      .where({
        user_name
      })
      .first();
  },
  comparePasswords(password, hash) { // method responsible for comparing string & hashed passwords
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) { // method responsible for creating a jwt token 
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':');
  },
};

module.exports = AuthService;