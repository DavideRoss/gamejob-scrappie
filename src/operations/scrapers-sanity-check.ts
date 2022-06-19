import { BaseOperation } from "./base-operation";

import { scrapers } from '../scrapers';

// TODO: add logging

export class ScrapersSanityCheck extends BaseOperation {
    constructor() {
        super();
        this.handle = 'scrapers-sanity-check';
    }

    public async run(options?: any) {
        const output = {};

        for (const scraper of scrapers) {
            try {
                const jobs = await scraper.scrape();

                if (jobs.length > 0)
                {
                    output[scraper.handle] = {
                        status: 'ok',
                        data: { results: jobs.length }
                    }
                } else {
                    output[scraper.handle] = {
                        status: 'warn',
                        data: { warning: 'no_jobs_found' }
                    }
                }
            } catch(err) {
                output[scraper.handle] = {
                    status: 'error',
                    data: { error: 'error_thrown', data: err }
                }
            }
        }

        return output;
    }
}
