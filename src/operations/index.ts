import { BaseOperation } from "./base-operation";

import { ScrapersSanityCheck } from "./scrapers-sanity-check";

const opsArray: BaseOperation[] = [
    new ScrapersSanityCheck
];

const Operations = {};
for (const op of opsArray) Operations[op.handle] = op;

export { Operations };
