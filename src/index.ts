import express from 'express';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';
import router from './router.js';
import morgan from 'morgan';

const app = express();
const PORT = 8080;

app.use(morgan('combined'))

const ACCOUNT_API_ENDPOINT = 'account';

app.use(`/${ACCOUNT_API_ENDPOINT}`, router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});