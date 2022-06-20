import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class SplashDamageScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Splash Damage';
        this.handle = 'splash-damage';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://www.splashdamage.com/careers/');
        const $ = cheerio.load(response.body);

        const depts = $('li[data-department=art],li[data-department=programming]');
        
        depts.each((i, dept) => {
            const deptName = $(dept).find('h4.component_joblist__department').text().trim();
            
            const items = $(dept).find('li.component_joblist__job');
            items.each((i, e) => {
                const link = 'https://www.splashdamage.com' + ($(e).find('a').attr('href') || '');
                const title = $(e).find('span.component_joblist__job__title').text().trim();
                const location = $(e).find('span.component_joblist__job__location').text().trim();

                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(link, 'ascii').digest('hex'),
                    scraperHandle: this.handle,
                    title,
                    department: deptName,
                    location,
                    link,
                    house: this.name,
                    date: new Date()
                });
            });
        });

        return jobs;
    }
}
