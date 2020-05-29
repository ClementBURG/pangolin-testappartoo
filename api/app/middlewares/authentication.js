import jwt from 'jsonwebtoken';
import Error from '../assets/error';

function checkToken(req) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
  return null;
}

let isAuthenticated = (req, res, next) => {
  const payload = checkToken(req);

  if (payload) {
    req.payload = payload;
    next();
  } else {
    const err = Error.getByCode('UNAUTHORIZED');
    res.status(err.status).send(err.data);
  }
};

let isNotAuthenticated = (req, res, next) => {
  const payload = checkToken(req);

  if (payload) {
    const err = Error.getByCode('ALREADY_SIGNED_IN');
    res.status(err.status).send(err.data);
  } else next();
};

module.exports = {
  isAuthenticated: isAuthenticated,
  isNotAuthenticated: isNotAuthenticated
};
