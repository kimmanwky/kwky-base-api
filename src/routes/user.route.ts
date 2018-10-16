import { Router } from 'express';
import authClient from '../core/auth-client';
import userController from './../controllers/user.controller';

export default class UserRoute {

  private route: Router = Router();
  private ctrl: userController = new userController();

  constructor(router: Router) {
    this.route.use(authClient);

    this.route.route('/user')
      .post(this.ctrl.createOne)
      .get(this.ctrl.getMany);

    this.route.route('/user/:userId')
      .get(this.ctrl.getOne)
      .patch(this.ctrl.updateOne)
      .delete(this.ctrl.deleteOne);

    router.use('/users', this.route);
  }
}
