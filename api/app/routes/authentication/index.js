import express from 'express';
import bcrypt from 'bcrypt';

import Error from '../../assets/error';
import UserModel from '../../models/user';
import AuthenticationAssets from '../../assets/authentication';
import authenticationMiddlewares from '../../middlewares/authentication';

const router = express.Router();

router.post('/register',
  authenticationMiddlewares.isNotAuthenticated,
  async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      const username = req.body.username.trim();
      if (await UserModel.findOne({username})) {
        throw Error.getByCode('USER_ALREADY_EXISTS');
      }

      const newUser = new UserModel({
        username: username,
        password: bcrypt.hashSync(req.body.password, 10)
      });

      try {
        await newUser.save();
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }

      res.status(200).send(AuthenticationAssets.genAuth(newUser));
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

router.post('/login',
  authenticationMiddlewares.isNotAuthenticated,
  async (req, res) => {
    try {
      let user;

      try {
        user = await UserModel.findOne({username: req.body.username});
      } catch (e) {
        throw Error.getByCode('INVALID_CREDS');
      }

      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        throw Error.getByCode('INVALID_CREDS');
      }

      res.status(200).send(AuthenticationAssets.genAuth(user));
    } catch (e) {
      res.status(e.status).send(e.data);
    }
  });

module.exports = router;
