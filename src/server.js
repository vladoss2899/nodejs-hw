import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import { connectionMongoDb } from './db/ConectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentsRoutes from './routes/studentsRoutes.js';
import authRoutes from './routes/authRouse.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(authRoutes);
app.use(studentsRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectionMongoDb();

app.listen(PORT, () => {
  console.log(`the server is running ${PORT}`);
});
