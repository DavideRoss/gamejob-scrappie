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

        const response = await got('https://www.mediatonicgames.com/careers');
        const $ = cheerio.load(response.body);

        const deptEl = $('.section-job-openings__category h2:contains(Art)').parent().eq(0);
        const items = $(deptEl).find('.job-openings__list-item');

        items.each((i, e) => {
            const title = $(e).find('.job-opening__title').text().trim();
            const link = $(e).find('.button').attr('href') || '';
            const location = $(e).find('.job-opening__subtitle').text().trim().replace('Art - ', '');

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update($(e).html() || '', 'ascii').digest('hex'),
                title,
                link,
                location,
                house: 'Mediatonic',
                department: 'Art',
                date: new Date()
            });
        });

        return jobs;
    }
}
