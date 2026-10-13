import express from 'express';
import path from 'path';

const app = express();

app.use(express.json());

app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));

export default app;