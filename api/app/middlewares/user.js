import Error from '../assets/error';

let isItMe = async (req, res, next) => {
  if (req.payload._id !== req.params.user_id) {
    const err = Error.getByCode('UNAUTHORIZED');
    return res.status(err.status).send(err.data);
  }

  next();
  return true;
};

module.exports = {
  isItMe: isItMe
};
