import express from 'express';

import Error from '../../assets/error';
import FriendModel from '../../models/friend';
import AuthenticationMiddlewares from '../../middlewares/authentication';

const router = express.Router();

router.get('/',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      let options = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      try {
        let list = await FriendModel.paginate({ user_id: req.payload._id }, options);
        await FriendModel.populate(list.docs, [{
          path: '_friend',
          select : 'username'
        }]);
        res.status(200).send(list);
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (err) {
      res.status(err.status).send(err.data);
    }
  });

router.get('/:friend_id',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      if (!req.params.friend_id) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      let friend;

      try {
        friend = await FriendModel.findById(req.params.friend_id)
          .populate('_friend', 'username');
      } catch (error) {
        throw Error.getByCode('DATABASE_ERROR');
      }

      if (!friend) {
        throw Error.getByCode('NOT_FOUND');
      }

      res.status(200).send(friend);
    } catch (err) {
      res.status(err.status).send(err.data);
    }
  });

router.post('/',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      if (!req.body) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      if (req.body._friend === req.payload._id) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      req.body.user_id = req.payload._id;

      if (await FriendModel.findOne(req.body)) {
        throw Error.getByCode('ALREADY_EXISTS');
      }

      try {
        let friend = new FriendModel(req.body);
        await friend.save();
        res.status(200).send(friend);
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (err) {
      res.status(err.status).send(err.data);
    }
  });

router.delete('/:friend_id',
  AuthenticationMiddlewares.isAuthenticated,
  async (req, res) => {
    try {
      if (!req.params.friend_id) {
        throw Error.getByCode('INVALID_PARAMETERS');
      }

      try {
        let friend = await FriendModel.findById({ _id: req.params.friend_id });
        await friend.remove();
        res.status(200).send({ success: true });
      } catch (e) {
        throw Error.getByCode('DATABASE_ERROR');
      }
    } catch (err) {
      res.status(err.status).send(err.data);
    }
  });

module.exports = router;
