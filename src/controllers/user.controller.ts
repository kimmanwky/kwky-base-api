import { Req, Resp } from './../lib/express';

import { UserModel } from 'kwky-base-model';

export default class UserController {

  createOne(req: Req, res: Resp) {
    if (!req.body.email) return res.sendError.badrequest('missing body.email');
    if (!req.body.firstName) return res.sendError.badrequest('missing body.firstName');
    if (!req.body.lastName) return res.sendError.badrequest('missing body.lastName');

    UserModel.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }, req.user._id).then((result) => {
      return res.sendSuccess('user created', result.data);
    }, (err) => {
      return res.sendError.badrequest(undefined, err);
    });
  }

  getMany(req: Req, res: Resp) {
    const q: any = {};
    if (req.query.email) q.email = req.query.email;
    UserModel.find(q, req.query.paging).then((result) => {
      return res.sendSuccess(undefined, result.results);
    }, (err) => {
      return res.sendError.badrequest(undefined, err);
    });
  }

  getOne(req: Req, res: Resp) {
    UserModel.findOne(req.params.userId).then((result) => {
      return res.sendSuccess(undefined, result);
    }, (err) => {
      return res.sendError.badrequest(undefined, err);
    });
  }

  updateOne(req: Req, res: Resp) {
    const u: any = {};
    if (req.body.firstName) u.firstName = req.body.firstName;
    if (req.body.lastName) u.lastName = req.body.lastName;

    UserModel.findOneAndUpdate(req.params.userId, u, req.user._id).then((result) => {
      return res.sendSuccess(undefined, result);
    }, (err) => {
      return res.sendError.badrequest(undefined, err);
    });
  }

  deleteOne(req: Req, res: Resp) {
    UserModel.remove(req.params.userId, req.user._id).then(() => {
      return res.sendSuccess('user removed');
    }, (err) => {
      return res.sendError.badrequest(undefined, err);
    });
  }
}
