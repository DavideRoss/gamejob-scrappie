export abstract class BaseScraper {
    public name = '(no name)';
    public handle = 'no_handle';

    public abstract scrape(): Promise<Job[]>;
}
