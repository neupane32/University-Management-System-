import { Router } from "express";
import path from "path";
import admin from '../routes/admin.routes';
import university from './university.route';
import teacher from './teacher.route';


export interface IndexRoute {
    path: string;
    route: Router;
}

const router = Router();

const routes: IndexRoute[] = [
    {
        path: '/admin',
        route: admin
    },

    {
        path: '/uni',
        route: university

    },

    {
        path: '/teach',
        route: teacher

    },
];



routes.forEach((route) => {
    router.use(route.path, route.route);
  });

  export default router;

