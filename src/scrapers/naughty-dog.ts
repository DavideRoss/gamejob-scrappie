import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class NaughtyDogScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'NaughtyDog';
        this.handle = 'naughtydog';
    }

    public async scrape(): Promise<Job[]> {
        let jobs: Job[] = [];

        const response = await got('https://www.naughtydog.com/careers', {
            https: { rejectUnauthorized: false }
        });

        const $ = cheerio.load(response.body);

        jobs = jobs.concat(this.getSection($, 'Animation'));
        jobs = jobs.concat(this.getSection($, 'Lighting & Visual Effects'));
        jobs = jobs.concat(this.getSection($, 'Art'));

        return jobs;
    }

    private getSection($, dept: string): Job[] {
        const jobs: Job[] = [];
        const deptEl = $(`.department a.d-block:contains(${dept})`).parent();

        deptEl.find('ul.jobs li').each((i, e) => {
            const title = $(e).find('a.link-off-white').text().trim();
            const link = $(e).find('a.link-off-white').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update($(e).html() || '', 'ascii').digest('hex'),
                title,
                link,
                location: 'N.D.',
                house: 'Naughty Dog',
                department: dept,
                date: new Date()
            });
        });

        return jobs;
    }
}
