import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class BlizzardScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Blizzard';
        this.handle = 'blizzard';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        let hits = 0;
        let totalHits = 0;

        do {
            const response = await got.post('https://careers.blizzard.com/widgets', {
                responseType: 'json',
                body: JSON.stringify({
                    lang: 'en_global',
                    deviceType: 'desktop',
                    country: 'global',
                    pageName: 'search-results',
                    ddoKey: 'refineSearch',
                    sortBy: '',
                    subsearch: '',
                    from: hits,
                    jobs: true,
                    counts: true,
                    all_fields: ['category','country','state','city','postalCode','type','externalTeamName','platformType'],
                    size: 50,
                    clearAll: false,
                    jdsource: 'facets',
                    isSliderEnable: false,
                    pageId: 'page14',
                    siteType: 'external',
                    keywords: '',
                    global: true,
                    selected_fields: {
                        category: ['Art / Animation']
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data: any = JSON.parse(response.body);

            if (data.refineSearch.status !== 200) {
                throw new Error(`Blizzard API responded "${data.refineSearch.status}", aborting.`);
            }

            hits += data.refineSearch.hits;
            totalHits = data.refineSearch.totalHits;

            for (const offering of data.refineSearch.data.jobs) {
                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.jobSeqNo, 'ascii').digest('hex'),
                    title: offering.title,
                    house: 'Blizzard Entertainment',
                    department: offering.category,
                    link: `https://careers.blizzard.com/global/en/job/${offering.jobSeqNo}`,
                    location: offering.cityStateCountry,
                    date: new Date(offering.postedDate)
                });
            }
        } while (hits < totalHits);

        return jobs;
    }
}
