import express from 'express';
import cors from 'cors';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';
import router from './router.js';
import morgan from 'morgan';

const app = express();
const PORT = 8080;

app.use(morgan('combined'))

const ACCOUNT_VISUAL_API_ENDPOINT = 'account';
const CORS_OPTIONS = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE"
};

app.use(cors(CORS_OPTIONS));


app.use(`/${ACCOUNT_VISUAL_API_ENDPOINT}`, router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});