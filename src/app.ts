import { BaseDatabase } from './databases/base-database';
import { BaseReporter } from './reporters/base-reporter';

import { reporters } from './reporters';
import { databases } from './databases';
import { scrapers } from './scrapers';
import { Options as options } from './utils/options';

import { API, ExpressOptions } from './api/api';

let db: BaseDatabase;
let reporter: BaseReporter;

// TODO: add logging service
// TODO: port scrapers from old project
// TODO: add express api for image hosting

// TODO: add telegram reporter
// TODO: add postgres db

// TODO: implement scraper preloading operation
// TODO: implement postings cleanup operation

const main = async () => {
    for (const scraper of scrapers) {
        // TODO: add banlist
        
        try {
            const jobs: Job[] = await scraper.scrape();
            console.log(`${scraper.name}: ${jobs.length}`);

            // await reporter.sendJob(scraper.handle, jobs[0]);
        } catch (error: any) {
            // TODO: logging
            console.log(error);
        }
    }

    // TODO: move value to options
    console.log('Done!');
    
    // TODO: move to settings
    setTimeout(main, 60 * 60 * 1000);
};

(async () => {
    process.on('unhandledRejection', async (reason: Error) => {
        // TODO: logging
        process.exit(0);
    });

    process.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });

    // TODO: configure banning

    await options.initalize();

    const reporterOptions = options['reporters'];
    reporter = reporters[reporterOptions.enabled];
    await reporter.initialize(reporterOptions['options'][reporter.handle]);
    
    const dbOptions = options['databases'];
    db = databases[dbOptions.enabled];
    await db.initialize(dbOptions['options'][db.handle]);
    
    const api = new API(options['api'] as ExpressOptions);
    api.listen();

    // main();
})();
