import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authenticationRoutes from './routes/authentication';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

app.use('/auth/', authenticationRoutes);

app.listen(process.env.SERVER_PORT, function(){
  console.log('Server is running on Port', process.env.SERVER_PORT);
});
