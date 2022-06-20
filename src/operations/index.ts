import { BaseOperation } from "./base-operation";

import { ScrapersSanityCheckOperation } from "./scrapers-sanity-check";
import { SingleScrapeOperation } from "./single-scrape";
import { PreloadScraperOperation } from "./preload-scraper";
import { TestScraperOperation } from "./test-scraper";

const opsArray: BaseOperation[] = [
    new ScrapersSanityCheckOperation,
    new SingleScrapeOperation,
    new PreloadScraperOperation,
    new TestScraperOperation
];

const Operations = {};
for (const op of opsArray) Operations[op.handle] = op;

export { Operations };
