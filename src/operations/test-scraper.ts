import { BaseOperation } from "./base-operation";

import { scrapers } from '../scrapers';
import { Logger } from "../utils/logger";
import { BaseDatabase } from "../databases/base-database";
import { databases } from "../databases";

import { Options } from "../utils/options";

export class TestScraperOperation extends BaseOperation {
    constructor() {
        super();
        this.handle = 'test-scraper';
    }

    public async run(options?: any) {
        const output: any = {};

        await Options.initalize();
        
        const scraper = scrapers.find(e => e.handle === options.scraper);
        if (!scraper) {
            output.result = 'error';
            output.data = 'scraper_not_found';
            return output;
        }

        const db: BaseDatabase = databases[options.db];
        await db.initialize(Options['databases']['options'][db.handle]);

        try {
            const hashes = await db.getHashes(scraper.handle);
            const jobs = await scraper.scrape();

            output.hashes = hashes;

            const reports: Job[] = [];
            for (const job of jobs) {
                if (!hashes.includes(job.hash)) reports.push(job);
            }

            output.result = 'ok';
            output.data = reports;
        } catch (err) {
            Logger.error('Error running single scrape operation', err);
            
            output.result = 'error';
            output.data = err;
        }

        return output;
    }
}
