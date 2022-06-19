export abstract class BaseScraper {
    public name: string = '(no name)';
    public handle: string = 'no_handle';

    public abstract scrape(): Promise<Job[]>;
}
