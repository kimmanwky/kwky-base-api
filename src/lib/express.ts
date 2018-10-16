import { Router, Request, Response, NextFunction } from 'express';

import { success, error } from './../core/response';

export interface Router extends Router { }
export interface Req extends Request {
  user: any;
}
export interface Resp extends Response {
  sendSuccess: (message?: string, data?: any) => void;
  sendError: {
    badrequest: (message?: string, err?: any) => void,
    unauthorized: (message?: string, err?: any) => void,
    forbidden: (message?: string, err?: any) => void,
    notfound: (message?: string, err?: any) => void,
    toomanyrequest: (message?: string, err?: any) => void,
    unknown: (message?: string, err?: any) => void,
    maintenance: (message?: string, err?: any) => void,
  };
}
export interface Next extends NextFunction { }

export function customExpress(req: Req, res: Resp, next: Next): void {
  res.sendSuccess = (message?: string, data?: any) => {
    return res.status(200).json(success(message, data));
  };

  res.sendError = {
    badrequest(message?: string, err?: any) {
      return res.status(400).json(error(message, err));
    },
    unauthorized(message?: string, err?: any) {
      return res.status(401).json(error(message, err));
    },
    forbidden(message?: string, err?: any) {
      return res.status(403).json(error(message, err));
    },
    notfound(message?: string, err?: any) {
      return res.status(404).json(error(message, err));
    },
    toomanyrequest(message?: string, err?: any) {
      return res.status(429).json(error(message, err));
    },
    unknown(message?: string, err?: any) {
      return res.status(500).json(error(message, err));
    },
    maintenance(message?: string, err?: any) {
      return res.status(500).json(error(message, err, true));
    }
  };

  next();
}
