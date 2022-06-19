import got from 'got';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class BungieScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Bungie';
        this.handle = 'bungie';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got('https://careers.bungie.com/jobs');
        const $ = cheerio.load(response.body);

        const data = JSON.parse($('script#__NEXT_DATA__').html() || '{}');
        const departments = _.filter(data.props.greenhouseData.teams, e => e.id === 27184 || e.id === 22331);

        for (const dept of departments) {
            for (const offering of dept.jobs) {
                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.id.toString(), 'ascii').digest('hex'),
                    title: offering.title,
                    link: `https://careers.bungie.com/jobs/${offering.id}/${this.getLinkHandle(offering.title)}`,
                    location: offering.location,
                    house: 'Bungie',
                    department: dept.name,
                    date: new Date()
                });
            }
        }

        return jobs;
    }

    private getLinkHandle(title: string): string {
        return _.kebabCase(title).replace('3-d', '3d');
    }
}
