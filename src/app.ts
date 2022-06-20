import { BaseDatabase } from './databases/base-database';
import { BaseReporter, LogLevel } from './reporters/base-reporter';

import { reporters } from './reporters';
import { databases } from './databases';
import { scrapers } from './scrapers';
import { Options as options } from './utils/options';

import { API, ExpressOptions } from './api/api';
import { Logger } from './utils/logger';

let db: BaseDatabase;
let reporter: BaseReporter;

const banList = {};

// TODO: add express api for image hosting

// TODO: add telegram reporter
// TODO: add postgres db

// TODO: implement postings cleanup operation

// TODO: activision and riot hashing not really working well

const scrape = async () => {
    for (const scraper of scrapers) {
        Logger.info(`Processing scraper "${scraper.handle}"`);

        if (banList[scraper.handle]) {
            if (Date.now() - banList[scraper.handle] < options['basic'].banLength) {
                Logger.info(`Scraper "${scraper.handle} skipped, in banlist`);
                continue;
            } else {
                Logger.info(`Scraper "${scraper.handle} ban expired, removed from banlist`);
                delete banList[scraper.handle];
            }
        }
        
        try {
            const hashes: string[] = await db.getHashes(scraper.handle);
            const jobs: Job[] = await scraper.scrape();

            const reports: Job[] = [];
            for (const job of jobs) {
                if (!hashes.includes(job.hash)) reports.push(job);
            }

            // TODO: move to settings
            if (reports.length >= 10) {
                reporter.sendBulkJobs(scraper.handle, reports);
            } else {
                for (const job of reports) reporter.sendJob(scraper.handle, job);
            }
        } catch (error: any) {
            Logger.error(`Error during scraping "${scraper.handle}"`, error);
            banList[scraper.handle] = Date.now();
            reporter.sendLog(LogLevel.Warning, `Scraper "${scraper.handle}" added to ban list`, error.stack);
        }
    }

    Logger.info('Cycle done!');
    setTimeout(scrape, options['basic'].interval);
};

(async () => {
    process.on('unhandledRejection', error => {
        Logger.error('Unhandled rejection', error);
        process.exit(0);
    });

    Logger.initalize();
    await options.initalize();

    const reporterOptions = options['reporters'];
    reporter = reporters[reporterOptions.enabled];
    await reporter.initialize(reporterOptions['options'][reporter.handle]);
    
    const dbOptions = options['databases'];
    db = databases[dbOptions.enabled];
    await db.initialize(dbOptions['options'][db.handle]);
    
    const api = new API(options['api'] as ExpressOptions);
    api.listen();

    Logger.info('Gamejob Scrappie ready!');
    // scrape();
})();
