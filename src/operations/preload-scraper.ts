import { BaseOperation } from "./base-operation";
import { BaseDatabase } from "../databases/base-database";

import { scrapers } from '../scrapers';
import { databases } from "../databases";

import { Logger } from "../utils/logger";
import { BaseScraper } from "../scrapers/base-scraper";

export class PreloadScraperOperation extends BaseOperation {
    constructor() {
        super();
        this.handle = 'preload-scraper';
    }

    public async run(options?: any) {
        const output: any = {
            data: []
        };

        const db: BaseDatabase = databases[options.db];
        const selScrapers: BaseScraper[] = scrapers.filter(e => options.scrapers.includes(e.handle));

        for (const scraper of selScrapers) {
            try {
                const jobs = await scraper.scrape();
    
                output.result = 'ok';
                output.data.push(...jobs);
                db.addRange(jobs);
            } catch (err) {
                Logger.error('Error running single scrape operation', err);
                
                output.result = 'error';
                output.data = err;
            }
        }

        return output;
    }
}
