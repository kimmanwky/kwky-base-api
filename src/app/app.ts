import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as fs from 'fs';
import * as rfs from 'rotating-file-stream';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';

import route from './route';
import { customExpress, Req, Resp } from './../lib/express';

class App {
  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    // add custom express handling action
    this.express.use(customExpress);

    this.initMiddleware();

    // register all routes
    new route(this.express);
  }

  // Configure Express middleware.
  private initMiddleware(): void {
    // add daily request logs
    if (config.get('log.enabled') === true) {
      const logDirectory = path.join('./logs');
      if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory); // ensure log directory exists

      // create a rotating write stream
      const accessLogStream = rfs.default('request.log', {
        size: config.get('log.maxFileSize') || '50M',
        interval: config.get('log.interval') || '1d',
        path: logDirectory
      });

      this.express.use(logger('combined', { stream: accessLogStream }));
    }

    this.express.use(logger('dev'));

    // set request limiter
    if (config.get('app.request.limit.enabled') === true) {
      const limiter = new rateLimit({
        windowMs: (<number>config.get('app.request.limit.periodInMinutes') || 5) * 60 * 1000,
        max: config.get('app.request.limit.max') || 150,
        delayMs: 0,
        keyGenerator: (req) => {
          return req.headers.authorization || req.ip; // priority limit via authorization token, else limit by ip
        },
        handler: (req: Req, res: Resp) => {
          res.setHeader('X-RateLimit-RetryAfter', <number>config.get('app.request.limit.periodInMinutes') * 60 * 1000);
          return res.sendError.toomanyrequest('Too many requests, please try again later.');
        }
      });

      //  apply to all requests
      this.express.use(limiter);
    }

    // Use helmet to secure Express headers
    this.express.use(helmet()); // use default

    // Add CORS
    this.express.use(
      cors({
        methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
        exposedHeaders: ['X-Auth-Token', 'X-Auth-Refresh-Token']
      })
    );

    // Add body parser plugin
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    // use gzip compression
    this.express.use(compression());
  }
}

export default new App().express;
