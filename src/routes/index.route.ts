import { Router } from "express";
import path from "path";
import admin from "../routes/admin.routes";
import university from "./university.route";
import teacher from "./teacher.route";
import subscription from "./subscription.routes";
import student from "./student.route";
import section from "./section.route";
import routine from "./routine.routes";
import resource from "./resource.routes";
import assignment from "./assignment.routes";
import attendance from "./attendance.routes";
import videocall from "./videocall.routes";
import chat from "./chat.routes";
import examRoutine from "./examRoutine.route";

export interface IndexRoute {
  path: string;
  route: Router;
}

const router = Router();

const routes: IndexRoute[] = [
  {
    path: "/admin",
    route: admin,
  },
  {
    path: "/student",
    route: student,
  },

  {
    path: "/uni",
    route: university,
  },

  {
    path: "/uni",
    route: section,
  },

  {
    path: "/routine",
    route: routine,
  },

  {
    path: "/teacher",
    route: teacher,
  },

  {
    path: "/subscription",
    route: subscription,
  },
  {
    path: "/resource",
    route: resource,
  },
  {
    path: "/assignment",
    route: assignment,
  },
  {
    path: "/attendance",
    route: attendance,
  },
  {
    path: "/call",
    route: videocall,
  },
  {
    path: "/chat",
    route: chat,
  },
  {
    path: "/exam-routine",
    route: examRoutine,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
