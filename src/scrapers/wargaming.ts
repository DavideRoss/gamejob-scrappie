import got from 'got';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class WargamingScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Wargaming';
        this.handle = 'wargaming';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const officeResponse = await got('https://wargaming.com/en/api/careers/office/', {
            responseType: 'json',
            searchParams: {
                department_slug: 'art'
            }
        });

        const offices = officeResponse.body as any[];

        let hits = 0;
        let totalHits = 0;

        do {
            const response = await got('https://wargaming.com/en/api/careers/vacancy/?offset=0&limit=50&department=1373', {
                responseType: 'json'
            });

            const data: any = JSON.parse(response.body);

            hits += data.results.length;
            totalHits = data.count;

            for (const offering of data.results) {
                const office = _.find(offices, (e: any) => e.id === offering.office);

                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.slug, 'ascii').digest('hex'),
                    scraperHandle: this.handle,
                    title: offering.title,
                    house: 'Wargaming',
                    department: 'Art Production',
                    link: `https://wargaming.com/en/careers/${offering.slug}`,
                    location: `${office.city_en} (${office.country_en})`,
                    date: new Date()
                });
            }

        } while (hits < totalHits);

        return jobs;
    }
}
