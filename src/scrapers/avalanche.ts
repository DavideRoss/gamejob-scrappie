import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class AvalancheScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Avalanche';
        this.handle = 'avalanche';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        let hits = 0;
        let totalHits = 0;
        let page = 1;

        do {
            const response = await got('https://api.teamtailor.com/v1/jobs?include=department,location,locations&page[size]=30&page[number]=' + page, {
                responseType: 'json',
                throwHttpErrors: false,
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Authorization': 'Token token=81eHATtJI0ByQcGqJbwhQvsqRYH3iIv-XSIAd0MC',
                    'X-Api-Version': '20161108',
                }
            });

            const data = JSON.parse(response.body) as any;

            hits += data.data.length;
            totalHits = data.meta['record-count'];
            page++;

            const deptIds = ['66934', '65292', '65291'];
            const deptTitles = ['Animation', 'Tech', 'Art'];

            const locations = {};
            for (const entry of data.included) {
                if (entry.type != 'locations') continue;
                locations[entry.id] = `${entry.attributes.city} (${entry.attributes.country})`;
            }

            for (const offering of data.data) {
                if (offering.relationships.department.data === null) continue;
                const deptId = offering.relationships.department.data.id;
                const deptIndex = deptIds.indexOf(deptId);
                if (deptIndex == -1) continue;
                
                const department = deptTitles[deptIndex];
                const title = offering.attributes.title;
                const link = 'https://avalanchestudios.com/jobs/' + offering.id;
                
                const locId = offering.relationships.location.data.id;
                const location = locations[locId]

                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(link, 'ascii').digest('hex'),
                    title,
                    department,
                    location,
                    link,
                    house: this.name,
                    date: new Date(offering.attributes['created-at'])
                });
            }

        } while (hits < totalHits);

        return jobs;
    }
}
