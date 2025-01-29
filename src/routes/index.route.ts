import { Router } from "express";
import path from "path";
import admin from '../routes/admin.routes';
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
];

routes.forEach((route) => {
    router.use(route.path, route.route);
  });

  export default router;

