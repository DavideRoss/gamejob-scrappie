import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class RockstarScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'Rockstar Games';
        this.handle = 'rockstar';
    }

    public async scrape(): Promise<Job[]> {
        let jobs: Job[] = [];

        const response = await got('https://www.rockstargames.com/careers/openings/search.json?&group=department', {
            responseType: 'json'
        });

        for (const deptKey of ['Art', 'Animation']) {
            const data: any = JSON.parse(response.body);
            const deptJobs = this.getJobsFromDept(data.openings[deptKey].openings);
            jobs = [...jobs, ...deptJobs];
        }

        return jobs;
    }

    private getJobsFromDept(dept: any) : Job[] {
        const jobs: Job[] = [];

        for (const loc of Object.keys(dept)) {
            for (const offering of dept[loc]) {
                jobs.push({
                    uuid: uuidv4(),
                    hash: createHash('md5').update(offering.apply_url, 'ascii').digest('hex'),
                    scraperHandle: this.handle,
                    title: offering.title,
                    house: offering.company.name,
                    department: offering.department,
                    link: offering.apply_url,
                    location: offering.company.location,
                    date: new Date(offering.created)
                });
            }
        }

        return jobs;
    }
}
