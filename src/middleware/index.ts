import cors from 'cors';
import express, { Request, Response, NextFunction, Application } from 'express';
import { DotenvConfig } from '../config/env.config';
import { StatusCodes } from '../constant/StatusCode';
import bodyParser from 'body-parser';
// import routes from '../routes/index.route';
import path from 'path';
import { errorHandler } from './errorHandler.middleware';
const middleware = (app: Application) => {
  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'];
    const apikey = req.headers['apikey'];
    if (userAgent && userAgent.includes('Mozilla')) {
      next();
    } else {
      if (apikey === DotenvConfig.API_KEY) {
        next();
      } else {
        res.status(StatusCodes.FORBIDDEN).send('Forbidden');
      }
    }
  });

  app.use(bodyParser.json());
  app.set('public', path.join(__dirname, '../', '../', 'public', 'content'));
  app.use(express.static(path.join(__dirname, '../', '../', 'public/content')));
  app.use(express.urlencoded({ extended: false }));
//   app.use('/api', routes);
//   app.use(errorHandler);
};

export default middleware;
