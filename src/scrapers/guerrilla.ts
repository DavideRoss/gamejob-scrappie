import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class GuerrillaScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Guerrilla';
        this.handle = 'guerrilla';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://www.guerrilla-games.com/join');
        const $ = cheerio.load(response.body);

        const items = $('.box-job__item');

        items.each((i, e) => {
            const title = $(e).find('.box-job__title').text().trim();

            // Skip open applications links
            if (title.toLowerCase() === 'open application') return;

            const department = $(e).find('._title').text().trim();

            // Filter by department
            if (['animation', 'art', 'character art', 'environment art', 'technical art', 'cinematics'].indexOf(department.toLowerCase()) == -1) return;

            const link = $(e).find('.box-job__title__link').attr('href') || '';
            const location = $(e).find('._meta-infos ._green').text().trim();

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                title,
                department,
                location,
                link,
                house: 'Guerrilla Games',
                date: new Date()
            });
        });

        return jobs;
    }
}