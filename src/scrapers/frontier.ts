import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class FrontierScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Frontier';
        this.handle = 'frontier';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://jobs.eu.lever.co/frontier/?department=Development&team=Art');
        const $ = cheerio.load(response.body);

        const items = $('.posting');

        items.each((i, e) => {
            const title = $(e).find('.posting-title h5').text().trim();
            const link = $(e).find('a.posting-title').attr('href') || '';
            const location = $('.posting-categories span').eq(0).text().trim();
            const department = $('.posting-categories span').eq(1).text().trim();

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                title,
                department,
                location,
                link,
                house: 'Frontier',
                date: new Date()
            });
        });

        return jobs;
    }
}
