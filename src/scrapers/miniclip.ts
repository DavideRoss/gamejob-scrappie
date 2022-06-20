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

        // FIXME: the department in the URL is ignored by the website
        // The site filters the voices locally
        // and parsing the department is too long to do now
        const response = await got('https://corporate.miniclip.com/careers/vacancies?department=Art');
        const $ = cheerio.load(response.body);

        $('.mb-7').each((i, e) => {
            const title = $(e).find('a.text-secondary').text().trim();
            const location = $(e).find('span:eq(1)').text().trim();
            const link = $(e).find('a.text-secondary').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update($(e).html() || '', 'ascii').digest('hex'),
                scraperHandle: this.handle,
                title,
                link: `https://corporate.miniclip.com${link}`,
                location,
                house: 'Miniclip',
                department: 'N.D.',
                date: new Date()
            });
        });

        return jobs;
    }
}
