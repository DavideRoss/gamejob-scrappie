export abstract class BaseOperation {
    public handle: string = 'no_handle';

    public abstract run(options?: any);
}
