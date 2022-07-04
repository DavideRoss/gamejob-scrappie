export enum LogLevel {
    Info, Warning, Error
}

export abstract class BaseReporter {
    public handle: string;

    public abstract initialize(options?: any);

    public abstract sendJob(scraperHandle: string, job: Job);
    public abstract sendBulkJobs(scraperHandle: string, jobs: Job[]);
    public abstract sendLog(level: LogLevel, title: string, data?: string);
}
