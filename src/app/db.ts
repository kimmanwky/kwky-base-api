import * as config from 'config';
import * as async from 'async';
import * as baseDb from 'kwky-base-model';

const db: any = {
  uri: config.get('db.mongo.default.uri'),
  options: config.get('db.mongo.default.options')
};

export function connect(cb) {
  async.waterfall([
    // connect to db
    (cb) => {
      return baseDb.connect(db.uri, db.options, cb);
    }

  ], (err, data) => {
    if (err) return console.log(err);
    return cb();
  });
}

export function disconnect(cb) {
  async.waterfall([
    // connect to db
    (cb) => {
      return baseDb.disconnect(cb);
    }

  ], (err, data) => {
    if (err) return console.log(err);
    return cb();
  });
}
