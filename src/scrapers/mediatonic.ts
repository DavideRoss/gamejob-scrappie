import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class MediatonicScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Mediatonic';
        this.handle = 'mediatonic';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got.get('https://mw-greenhouse-service-prod.debc.live.use1a.on.epicgames.com/api/job?limit=50&skip=0&page=1&company=Mediatonic&department=Art%20%26%20Animation&gh_src=1d0ec4e74us');
        const data: any = JSON.parse(response.body);

        for (const raw of data.hits) {
            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(raw.absolute_url, 'ascii').digest('hex'),
                title: raw.title,
                link: raw.absolute_url,
                location: raw.location.name,
                house: 'Mediatonic',
                department: raw.department,
                date: new Date()
            });
        }

        return jobs;
    }
}
