import { BaseOperation } from "./base-operation";

import { ScrapersSanityCheckOperation } from "./scrapers-sanity-check";
import { SingleScrapeOperation } from "./single-scrape";

const opsArray: BaseOperation[] = [
    new ScrapersSanityCheckOperation,
    new SingleScrapeOperation
];

const Operations = {};
for (const op of opsArray) Operations[op.handle] = op;

export { Operations };
