import winston from 'winston';

export abstract class Logger {
    private static _logger: winston.Logger;

    public static initalize() {
        this._logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.json()
            )
        });
    }

    public static info(msg: string, meta?) {
        this._logger.info(msg, meta);
    }

    public static warn(msg: string, meta?) {
        this._logger.warn(msg, meta);
    }

    public static error(msg: string, error: any) {
        this._logger.error(msg, error);
    }
}
