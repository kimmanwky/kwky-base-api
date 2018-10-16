import { Req, Resp, Next } from './../lib/express';
import * as fs from 'fs';

export default function (req: Req, res: Resp, next: Next) {
  fs.readFile('.maintenance', 'utf8', (err, maintenance) => {
    if (!err && maintenance === 'true') return res.status(400).json(res.sendError.maintenance('Server under maintenance', undefined));
    next();
  });
}
