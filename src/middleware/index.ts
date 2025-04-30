import cors from "cors";
import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import routes from "../routes/index.route";
import path from "path";
import morgan from "morgan";

import BcryptService from "../utils/bcrypt.utils";
const bcryptservice = new BcryptService();

const middleware = (app: Application) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"];
    next();
  });
  app.use(morgan("common")); // 'dev' is a predefined format string
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "..", "uploads"))
  );
  app.use(bodyParser.json());
  app.set("public", path.join(__dirname, "../", "../", "public", "content"));
  app.use(express.static(path.join(__dirname, "../", "../", "public/content")));
  app.use(express.urlencoded({ extended: false }));
  app.use("/api", routes);
  //   app.use(errorHandler);
};

export default middleware;
