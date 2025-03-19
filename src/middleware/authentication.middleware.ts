import { type NextFunction, type Request, type Response } from 'express';
import { DotenvConfig } from '../config/env.config';
import HttpException from '../utils/HttpException.utils';
import tokenService from '../utils/webToken.utils';
export const authentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokens = req.headers.authorization?.split(' ');
    try {
      if (!tokens) {
        throw HttpException.unauthorized('You are not authenticated ');
      }
      const mode = tokens[0];
      const accessToken = tokens[1];

      if (mode != 'Bearer' || !accessToken)
        throw HttpException.unauthorized('You are not authenticated ');
      const payload = tokenService.verify(accessToken, DotenvConfig.ACCESS_TOKEN_SECRET);
      if (payload) {
        req.user = payload;
        next();
      } else {
        throw HttpException.unauthorized('You are not authenticated ');
      }
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        next(HttpException.unauthorized('Token expired'));
        return;
      }
      return next(HttpException.unauthorized('You are not authenticated '));
    }
  };
};



