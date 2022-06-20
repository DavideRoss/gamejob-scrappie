import express from 'express';
import basicAuth from 'express-basic-auth';

import { Operations } from '../operations';
import { Logger } from '../utils/logger';

export class API {
    private app: express.Application;
    private options: ExpressOptions;

    constructor(options: ExpressOptions) {
        this.options = options;

        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        this.app.use(basicAuth({
            users: { [options.username]: options.password }
        }));

        this.app.post('/operation', async (req, res) => {
            if (!(req.body.operation in Operations)) {
                return this.sendError(res, 'operation_not_found');
            }

            try {
                const opResult = await Operations[req.body.operation].run(req.body.options);
                this.send(res, 'success', opResult);
            } catch (err) {
                Logger.error('Operation error', err);
                this.sendError(res, 'operation_error_thrown', err);
            }
        });

        // TODO: add static logo path
    }

    public listen() {
        this.app.listen(this.options?.port, () => {
            Logger.info(`API listening on port ${this.options.port}`);
        });
    }

    private send(res, status: string, data: any = null, statusCode: number = 200) {
        res.status(statusCode);
        res.send({ status, data });
    }

    private sendError(res, error: string, data: any = null, statusCode: number = 400) {
        res.status(statusCode);
        res.send({
            status: 'error',
            error, data
        });
    }
}

export interface ExpressOptions {
    port: number;
    username: string;
    password: string;
}