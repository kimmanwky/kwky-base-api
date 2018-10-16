import { Req, Resp, Next } from './../lib/express';

export default function (req: Req, res: Resp, next: Next) {
  req.user = {
    _id: 'system' // TODO: Temp set user._id to 'system'
  };

  next();
}
