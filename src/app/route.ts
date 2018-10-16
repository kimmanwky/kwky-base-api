import { Router } from 'express';

import * as config from 'config';
import * as glob from 'glob';
import * as path from 'path';

import ping from './../core/ping';
import filter from './../core/filter';
import * as resp from './../core/response';

export default class Route {
  router: Router;

  constructor(private app) {
    this.router = Router();

    this.init();
  }

  init() {
    this.app.use(ping);
    this.app.use(filter);

    const sourcePath = config.get('sourcePath');

    // Auto require all sub routes
    glob.sync(`./${sourcePath}/routes/*.route.js`).forEach((file) => {
      import(path.resolve(file)).then((f: any) => {
        new f.default(this.router);
      });
    });

    // prefix for all routes
    this.app.use('/api', this.router);

    // If all routes not handled / not found, then use this!
    this.app.use((req, res) => {
      res.status(400).json(resp.error('Bad Request'));
    });
  }
}
