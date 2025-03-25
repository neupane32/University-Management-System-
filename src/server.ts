import { createServer } from 'http';
import app from './config/app.config';
import { DotenvConfig } from './config/env.config';
import { AppDataSource } from './config/database.config';
import adminSeedMiddleware from "./middleware/adminSeed.middleware";
async function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  httpServer.listen(PORT);
  console.log(`Server is Listening on port : ${DotenvConfig.PORT} `);
}
AppDataSource.initialize()
.then(async () => {
  console.log('Database connected successfully');
  listen();
  adminSeedMiddleware.seedAdmin()
  })
  .catch((err) => {
    console.log(`Database failed to connect`, err);
  });