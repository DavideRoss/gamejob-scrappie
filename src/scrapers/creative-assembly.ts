import got from 'got';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import { BaseScraper } from './base-scraper';

export class CreativeAssemblyScraper extends BaseScraper {
    constructor() {
        super();
        this.name = 'CreativeAssembly';
        this.handle = 'creativeassembly';
    }

    public async scrape(): Promise<Job[]> {
        const jobs: Job[] = [];

        const response = await got.post('https://www.creative-assembly.com/views/ajax?_wrapper_format=drupal_ajax', {
            responseType: 'json',
            insecureHTTPParser: true,
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,pl;q=0.5,de;q=0.4',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                pragma: 'no-cache',
                'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
                cookie: 'visid_incap_589232=xx3tves1Tq6x3oDwTPZsGfomrWAAAAAAQUIPAAAAAADzJbFhWpbLGHQBoroxU23L; _ga=GA1.2.974193997.1621960446; cookieconsent_status=dismiss; nlbi_589232=TJyPTEMxERd6ypK2P2AItAAAAADgWDaryW7GycEpBfU0vE8i; incap_ses_629_589232=A3FwY555mGr/72PRTai6CMgX12AAAAAAHPMW1juugZr6nHsYpxfO0g==; _gid=GA1.2.1209671272.1624709067; _gat_UA-54762529-4=1; _gat_UA-35103939-2=1; nlbi_589232_2147483646=VTonUE+7SUKbgup1P2AItAAAAACY5FpKK4Qop5Wtk6RHekAo; reese84=3:DRr5nSDI0Xsmz0qgSmDkGA==:4LKBJBx2ZpGsYkByKiiKOeM2rxozZ2ptuGbOsutbuUON6AMRLfdUYiH+1RzVzpE2FvGwFc6rqO+R4Ko8D/CAJP5AjEZgiJ+zEJv7Z/llGuU/o52IJpUnlnr4z93cXMQu32tIOFuaf2MNWcVancLWa4qOT4QPgboUatqip12qS/PcC59iiMILInW1SlIyBPjipUCFuAxG19LnNkiAuDp9iGTBxIdC6VTWZdeRsPqlKeBEkoXFdmqFDhzuISKYyoBhJO6e5EecdFDs8gaxxmO6TvH63A4pLHkKZRw2zIQbLK87WQUIZ7q5CZGR8OlxsmNuuLwYj3DVbaQh/Yzn3zJqcbZ4pmB1MVapmloy4/UKtTp6p2P0ICQHdj73VXpdRZyuNT+d0OnQI1zMh6RJZMB0go7BG9j5XcmNEqW26xIC1Zc=:Hh4io09fUng4f9V6pwlxB8iD0IZu2FxYgYkcEq/bIRA='
            },
            body: 'field_jobvite_category_new_target_id%5B%5D=240&field_jobvite_category_new_target_id%5B%5D=236&view_name=jobvite&view_display_id=page_1&view_args=&view_path=%2Fcareers&view_base_path=careers&view_dom_id=6638efd26a6f79b4228fb17424bd61f75e4c99206d1e41b4a5096c7873b455a3&pager_element=0&_drupal_ajax=1&ajax_page_state%5Btheme%5D=creative_assembly&ajax_page_state%5Btheme_token%5D=&ajax_page_state%5Blibraries%5D=classy%2Fbase%2Cclassy%2Fmessages%2Ccore%2Fhtml5shiv%2Ccore%2Fnormalize%2Ccreative_assembly%2Fglobal-css%2Ccreative_assembly%2Fglobal-js%2Csystem%2Fbase%2Cviews%2Fviews.ajax%2Cviews%2Fviews.module',
        } as any);

        const data: any = JSON.parse(response.body);
        const jobsCommand = data.find(e => e.command === 'insert');

        const $ = cheerio.load(jobsCommand.data);
        const offerings = $('.views-row');

        for (const offering of offerings) {
            const title = $(offering).find('.views-field-title span a').text();
            const link = $(offering).find('.views-field-title span a').attr('href') || '';
            const department1 = $(offering).find('.views-field-field-jobvite-department .field-content').text();
            const department2 = $(offering).find('.views-field-field-jobvite-category-new .field-content').text();

            jobs.push({
                uuid: uuidv4(),
                hash: createHash('md5').update(link, 'ascii').digest('hex'),
                scraperHandle: this.handle,
                title,
                department: `${department1} (${department2})`,
                location: 'N.D.',
                link: `https://www.creative-assembly.com${link}`,
                house: 'Creative Assembly',
                date: new Date()
            });
        }

        return jobs;
    }
}
