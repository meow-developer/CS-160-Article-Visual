import express from 'express';
import cors from 'cors';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';
import diagramRouter from './router/diagramRouter.js';

const app = express();
const PORT = 8080;

const DIAGRAM_API_ENDPOINT = 'diagram';
const CORS_OPTIONS = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE"
};

app.use(cors(CORS_OPTIONS));


app.use(`/${DIAGRAM_API_ENDPOINT}`, diagramRouter);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});