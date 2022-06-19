import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class MiniclipScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Miniclip';
        this.handle = 'miniclip';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://corporate.miniclip.com/careers/vacancies/?department=Art');
        const $ = cheerio.load(response.body);-

        $('.vacancies-offer').each((i, e) => {
            const title = $(e).find('a.vacancies-search-list-link').text().trim();
            const location = $(e).find('.vacancies-search-list-column:eq(1)').text().trim();
            const link = $(e).find('a.vacancies-search-list-link').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update($(e).html() || '', 'ascii').digest('hex'),
                title,
                link: `https://corporate.miniclip.com${link}`,
                location,
                house: 'Miniclip',
                department: 'Art',
                date: new Date()
            });
        });

        return jobs;
    }
}
