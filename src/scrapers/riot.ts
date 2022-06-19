import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class RiotScrape extends BaseScraper {
    constructor() {
        super();
        this.name = 'Riot Games';
        this.handle = 'riotgames';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://www.riotgames.com/en/work-with-us/jobs');
        const $ = cheerio.load(response.body);

        $('.job-row').each((i, e) => {
            const title = $(e).find('.job-row__col--primary').text().trim();
            const dept1 = $(e).find('.job-row__col--secondary').eq(0).text().trim();
            const dept2 = $(e).find('.job-row__col--secondary').eq(1).text().trim();
            const location = $(e).find('.job-row__col--secondary').eq(2).text().trim();
            const link = $(e).find('a.job-row__inner').attr('href') || '';

            if (['art', 'art - cg', 'creative'].indexOf(dept1.toLowerCase()) == -1) return;

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                title,
                link: `https://www.riotgames.com${link}`,
                location,
                house: 'Riot Games',
                department: `${dept2} (${dept1})`,
                date: new Date()
            });
        });

        return jobs;
    }
}
