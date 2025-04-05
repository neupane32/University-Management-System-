import { Router } from "express";
import path from "path";
import admin from '../routes/admin.routes';
import university from './university.route';
import teacher from './teacher.route';
import subscription from './subscription.routes';
import student from './student.route';
import section from './section.route';
import routine from './routine.routes';
import resource from './resource.routes';
import assignment from './assignment.routes';

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
        path: '/student',
        route: student
    },

    {
        path: '/uni',
        route: university

    },

    {
        path: '/uni',
        route: section
    },

    {
        path: '/routine',
        route: routine

    },

    {
        path: '/teacher',
        route: teacher

    },

    {
        path: '/subscription',
        route: subscription

    },
    {
        path: '/resource',
        route: resource

    },
    {
        path: '/assignment',
        route: assignment

    },
];



routes.forEach((route) => {
    router.use(route.path, route.route);
  });

  export default router;

