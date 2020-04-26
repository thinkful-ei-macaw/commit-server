const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;

  /**  Return 401 error if Authorization starts with bearer or "Authorization" is lowercase within header*/

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({
      error: 'Missing bearer token'
    });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
  
    const payload = AuthService.verifyJwt(bearerToken); 
    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if (!user)
          return res.status(401).json({
            error: 'Unauthorized request'
          });

        req.user = user;
        next();
      })
      .catch(err => {
        next(err);
      });
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized request'
    });
 
  }
}

module.exports = {
  requireAuth,
};