import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class ActivisionScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Activision';
        this.handle = 'activision';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        let hits = 0;
        let totalHits = 0;

        do {
            const response = await got.post('https://careers.activision.com/widgets', {
                responseType: 'json',
                body: JSON.stringify({
                    lang: 'en_us',
                    deviceType: 'desktop',
                    country: 'us',
                    pageName: 'search-results',
                    ddoKey: 'refineSearch',
                    sortBy: 'Most recent',
                    subsearch: '',
                    from: hits,
                    jobs: true,
                    counts: true,
                    all_fields: [
                        'category',
                        'state',
                        'country',
                        'city',
                        'type'
                    ],
                    size: 50,
                    clearAll: false,
                    jdsource: 'facets',
                    isSliderEnable: false,
                    keywords: '',
                    global: true,
                    selected_fields: {}
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data: any = JSON.parse(response.body);

            hits += data.refineSearch.hits;
            totalHits = data.refineSearch.totalHits;
    
            for (const offering of data.refineSearch.data.jobs) {
                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.jobId, 'ascii').digest('hex'),
                    title: offering.title,
                    house: 'Activision',
                    department: offering.category,
                    link: `https://careers.activision.com/job/${offering.jobId}`,
                    location: offering.cityStateCountry,
                    date: new Date(offering.postedDate)
                });
            }
        } while (hits < totalHits);

        return jobs;
    }
}
