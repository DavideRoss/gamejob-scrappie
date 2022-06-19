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

// TODO: cleanup?
// export class ReporterArray extends Array<BaseReporter> {
//     public async initialize(options?: any) { for (const rep of this) await rep.initialize(options) }

//     public async sendJob(scraperHandle: string, job: Job) { for (const rep of this) await rep.sendJob(scraperHandle, job) }
//     public async sendBulkJobs(scraperHandle: string, jobs: Job[]) { for (const rep of this) await rep.sendBulkJobs(scraperHandle, jobs) }
//     public async sendLog(level: LogLevel, title: string, data?: string) { for (const rep of this) await rep.sendLog(level, title, data) }
// }