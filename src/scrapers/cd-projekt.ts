import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class CDProjektScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'CD Projekt RED';
        this.handle = 'cdprojektred';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://en.cdprojektred.com/jobs/?job-category=art');
        const $ = cheerio.load(response.body);

        $('article.job').each((_i, e) => {
            const title = $(e).find('h2.entry-title a').text().trim();                
            const department = $(e).find('.entry-meta span').eq(0).text().trim();
            const location = $(e).find('.entry-meta span').eq(1).text().trim();
            const link = $(e).find('h2.entry-title a').attr('href') || '';

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update($(e).html() || '', 'ascii').digest('hex'),
                title,
                link,
                location,
                house: 'CD Projekt RED',
                department: department || 'Art',
                date: new Date()
            });
        });

        return jobs;
    }
}
