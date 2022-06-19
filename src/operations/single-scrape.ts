import { BaseOperation } from "./base-operation";

import { scrapers } from '../scrapers';

export class SingleScrapeOperation extends BaseOperation {
    constructor() {
        super();
        this.handle = 'single-scrape';
    }

    public async run(options?: any) {
        const output: any = {};

        const scraper = scrapers.find(e => e.handle === options.scraper);
        if (!scraper) {
            output.result = 'error';
            output.data = 'scraper_not_found';
            return output;
        }

        try {
            const jobs = await scraper.scrape();

            output.result = 'ok';
            output.data = jobs;
        } catch(err) {
            console.log(err);
            output.result = 'error';
            output.data = err;
        }

        return output;
    }
}
