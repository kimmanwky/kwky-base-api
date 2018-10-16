import { Req, Resp, Next } from './../lib/express';

import * as config from 'config';
import * as _ from 'lodash';

export default function (req: Req, res: Resp, next: Next) {
  // const filter: any = {};
  const paging: any = {};

  // default filter
  // filter.lang = req.query.lang || 'en';

  // default paging
  paging.limit = Number(req.query.limit) || Number(config.get('pagination.default.limit')) || 15;
  // set min max limit for paging limit at maximum 100
  paging.limit = paging.limit <= 0 || paging.limit > 100 ? (Number(config.get('pagination.default.limit')) || 15) : paging.limit;
  paging.sortDir = req.query.sortdir || config.get('pagination.default.sortDir') || 'asc';
  paging.sortBy = req.query.sortby || config.get('pagination.default.sortBy') || '_id';
  paging.sort = {};
  const sbList = paging.sortBy.split(',');
  const sdList = paging.sortDir.split(',');
  _.forEach(sbList, (value, key) => {
    paging.sort[value] = sdList[key];
  });

  paging.mode = req.query.mode || config.get('pagination.default.mode') || 'nopaging';
  paging.page = Number(req.query.page) || Number(config.get('pagination.default.page')) || 1;
  paging.nextToken = req.query.nexttoken;

  // add filter and paging into query
  // req.query.filter = filter;
  req.query.paging = paging;

  next();
}
