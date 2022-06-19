import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import * as querystring from 'querystring';

import { BaseScraper } from './base-scraper';

export class UbisoftScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Ubisoft';
        this.handle = 'ubisoft';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const query: any = {
            highlightPreTag: '<ais-highlight-0000000000>',
            highlightPostTag: '</ais-highlight-0000000000>',
            query: '',
            maxValuesPerFacet: 100,
            page: 0,
            facets: JSON.stringify(['jobFamily', 'team', 'countryCode', 'city', 'contractType', 'graduateProgram']),
            tagFilters: '',
            facetFilters: JSON.stringify([
                ['jobFamily:Art & Animation']
            ])
        };

        let hits = 0;
        let totalHits = 0;

        do {
            const response = await got.post('https://avcvysejs1-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.4)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.3.4)%3B%20react%20(16.12.0)%3B%20react-instantsearch%20(6.8.3)&x-algolia-api-key=7d1048c332e18838e52ed9d41a50ac7b&x-algolia-application-id=AVCVYSEJS1', {
                responseType: 'json',
                body: JSON.stringify({
                    requests: [{
                        indexName: 'jobs_en-us_default',
                        params: new URLSearchParams(query).toString()
                    }]
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
    
            const data: any = JSON.parse(response.body);
    
            for (const offering of data.results[0].hits) {
                const country = (offering.countryCode as string).toUpperCase();
    
                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.slug, 'ascii').digest('hex'),
                    title: offering.title,
                    house: 'Ubisoft',
                    department: offering.jobFamily,
                    link: `https://www.ubisoft.com/en-us/company/careers/search/${offering.slug}`,
                    location: `${offering.city} (${country})`,
                    date: new Date(offering.createdAt)
                });
            } 

            hits += data.results[0].hits.length;
            totalHits = data.results[0].nbHits;
            query.page++;
        } while (hits < totalHits);

        return jobs;
    }
}
