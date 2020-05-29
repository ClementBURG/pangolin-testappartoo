import express from 'express';

import Error from '../../assets/error';
import UserModel from '../../models/user';
import AuthenticationMiddlewares from '../../middlewares/authentication';
import UserMiddlewares from '../../middlewares/user';

const router = express.Router();

router.get('/search',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      let query = {};
      let options = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        select: { password: 0 }
      };

      //by username
      if (req.query.username) {
        query.username = { $regex : req.query.username, '$options' : 'i' };
      }

      try {
        let list = await UserModel.paginate(query, options);
        res.status(200).send(list);
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

router.get('/:user_id',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      if (!req.params.user_id) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      let user;

      try {
        user = await UserModel.findById(req.params.user_id);
      } catch (error) {
        throw Error.getByCode('DATABASE_ERROR');
      }

      if (!user) {
        throw Error.getByCode('NOT_FOUND');
      }

      res.status(200).send(user);
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

router.put('/:user_id',
  AuthenticationMiddlewares.isAuthenticated,
  UserMiddlewares.isItMe,
  async (req, res) => {
    try {
      if (!req.params.user_id || !req.body) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      try {
        let user = await UserModel.findByIdAndUpdate(
          { _id : req.params.user_id },
          req.body,
          { new: true });

        res.status(200).send(user);
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

router.delete('/:user_id',
  AuthenticationMiddlewares.isAuthenticated,
  UserMiddlewares.isItMe,
  async (req, res) => {
    try {
      if (!req.params.user_id) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      try {
        let user = await UserModel.findById({ _id: req.params.user_id });
        await user.remove();
        res.status(200).send({ success: true });
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

module.exports = router;
