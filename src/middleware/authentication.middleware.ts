import { type NextFunction, type Request, type Response } from 'express';
import { DotenvConfig } from '../config/env.config';
import HttpException from '../utils/HttpException.utils';
import tokenService from '../utils/webToken.utils';
export const authentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokens = req.headers.authorization?.split(' ');
    console.log("🚀 ~ return ~ tokens:", tokens)
    try {
      if (!tokens) {
        console.log("🚀 ~ return ~ tokens:", tokens)
        throw HttpException.unauthorized('You are not authorized ');
      }
      const mode = tokens[0];
      console.log("🚀 ~ return ~ mode:", mode)
      const accessToken = tokens[1];
      console.log("🚀 ~ return ~ accessToken:", accessToken)

      if (mode != 'Bearer' || !accessToken)
        throw HttpException.unauthorized('You are not authorized ');
      const payload = tokenService.verify(accessToken, DotenvConfig.ACCESS_TOKEN_SECRET);
      if (payload) {
        req.user = payload;
        next();
      } else {
        throw HttpException.unauthorized('You are not authorized ');
      }
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        next(HttpException.unauthorized('Token expired'));
        return;
      }
      return next(HttpException.unauthorized('You are not authorized '));
    }
  };
};



