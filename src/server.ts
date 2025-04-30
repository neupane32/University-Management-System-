import { createServer } from 'http';
import app from './config/app.config';
import { DotenvConfig } from './config/env.config';
import { AppDataSource } from './config/database.config';
import adminSeedMiddleware from "./middleware/adminSeed.middleware";
import { initializeSocket } from './socket/socket';
import { CronService } from './services/cron.service';
async function listen() {
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  initializeSocket(httpServer)
  httpServer.listen(PORT);

  console.log(`Server is Listening on port : ${DotenvConfig.PORT} `);
}
AppDataSource.initialize()
.then(async () => {
  console.log('Database connected successfully');
  listen();
  adminSeedMiddleware.seedAdmin()
  new CronService();

  })
  .catch((err) => {
    console.log(`Database failed to connect`, err);
  });