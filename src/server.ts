import app from './app';
import {env} from './config/env';
import {createLogger} from './infrastructure/logger/create-logger';
import {errorHandler} from './interface/http/v1/middlewares/errorHandler';
import routes from './interface/http/v1/routes/api/api';
import path from 'path';

const port = env.PORT;

const logger = createLogger();

app.use('/api/v1',routes);

app.use(errorHandler);

app.listen(port,()=>{
    console.log('server.ts is running on port',port);
    logger.info(`Server is running on port ${port}`);
});