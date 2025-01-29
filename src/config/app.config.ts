import express from 'express';
import sanitizeHtml from 'sanitize-html';
import middleware from '../middleware/index';
const app = express();

app.use((_, res, next) => {
  next();
});
middleware(app);
export default app;
