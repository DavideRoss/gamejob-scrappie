import path from 'path';
import express from 'express';
import basicAuth from 'express-basic-auth';

import { Operations } from '../operations';
import { Logger } from '../utils/logger';
import { Options } from '../utils/options';

export class API {
    private app: express.Application;
    private options: ExpressOptions;

    constructor(options: ExpressOptions) {
        this.options = options;

        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        const logosOptions = Options['logos'];
        if (logosOptions.enabled) {
            this.app.use(logosOptions.webRoot, express.static(path.join(__dirname, logosOptions.relativePath)))
        }
        
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
    }

    public listen() {
        this.app.listen(this.options?.port, () => {
            Logger.info(`API listening on port ${this.options.port}`);
        });
    }

    private send(res, status: string, data = null, statusCode = 200) {
        res.status(statusCode);
        res.send({ status, data });
    }

    private sendError(res, error: string, data: null|unknown = null, statusCode = 400) {
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