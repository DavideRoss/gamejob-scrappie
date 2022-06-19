import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import FormData from 'form-data';

import { BaseScraper } from './base-scraper';

export class GameloftScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Gameloft';
        this.handle = 'gameloft';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const form = new FormData();
        form.append('groupDetails', '["86", "87"]');

        const response = await got.post('https://www.gameloft.com/corporate/en/jobs/get-job-list-revamp/', {
            responseType: 'json',
            body: form
        });

        const data: any = response.body;

        for (const offering of data.details) {
            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(offering.apply_url, 'ascii').digest('hex'),
                title: offering.job_title,
                link: offering.apply_url,
                location: `${offering.city} (${offering.country})`,
                house: 'Gameloft',
                department: offering.category,
                date: new Date()
            });
        }

        return jobs;
    }
}
