import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import FormData from 'form-data';

import { BaseScraper } from './base-scraper';

export class MassiveScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Massive';
        this.handle = 'massive';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const form = new FormData();
        form.append('action', 'get_jobs');
        form.append('paged', '0');
        form.append('family[]', [109, 113].join(','));

        const response = await got.post('https://www.massive.se/wp-content/themes/massive/inc/ajax.php', {
            responseType: 'json',
            body: form
        });

        const data: any = JSON.parse(response.body);

        for (const offering of data.data.jobs)
        {
            const $ = cheerio.load(offering);

            const title = $('.jobs__title').text().trim();
            const dept1 = $('.jobs__cell-inner[data-sort=project]').text().trim();
            const dept2 = $('.jobs__cell-inner[data-sort=family]').text().trim();
            const location = $('.jobs__cell-inner[data-sort=location]').text().trim();
            const link = $('a.jobs__row ').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                title,
                link,
                location,
                house: 'Massive',
                department: `${dept2} (${dept1 || 'N.D.'})`,
                date: new Date()
            });
        }

        return jobs;
    }
}
