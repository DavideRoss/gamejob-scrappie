export abstract class BaseDatabase {
    public name = '(no name)';
    public handle = 'no_handle';

    public abstract initialize(options?: any);

    public abstract getHashes(handle: string): Promise<string[]>;

    public abstract findHash(hash: string): Promise<boolean>;
    public abstract add(job: Job);
    public abstract addRange(jobs: Job[]);
}

export class DatabaseError extends Error {
    public data: any;

    constructor(msg: string, data?: any) {
        super(msg);
        this.data = data;
    }
}
