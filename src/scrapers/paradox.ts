import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class ParadoxScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Paradox Interactive';
        this.handle = 'paradox';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const departments = [
            'Art',
            'Games Programming',
            'Paradox Arctic',
            'Paradox Thalassic',
            'Paradox Tinto',
            'Tectonic Studio'
        ];

        const response = await got('https://career.paradoxplaza.com/jobs');
        const $ = cheerio.load(response.body);

        const items = $('#section-jobs ul li');

        items.each((i, e) => {
            const meta = $(e).find('div.sm\\:whitespace-nowrap span').text().split('·').map(e => e.trim());
            const dept = meta.length == 2 ? meta[0] : '';
            const location = meta.length == 2 ? meta[1] : meta[0];

            if (departments.indexOf(dept) == -1) return;

            const title = $(e).find('a span').eq(0).text().trim();
            const link = $(e).find('a').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                title,
                department: dept,
                location,
                link,
                house: this.name,
                date: new Date()
            });
        });

        return jobs;
    }
}
