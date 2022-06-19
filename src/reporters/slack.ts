import { BaseReporter, LogLevel } from "./base-reporter";

import { WebClient } from "@slack/web-api";
import * as _ from 'lodash';

export class SlackReporter extends BaseReporter {
    // TODO: move to options
    private static BASE_URL: string = 'https://data.iamdavi.de/logos';

    private _client: WebClient;
    private _channel: string;

    private _emojis: Map<LogLevel, string> = new Map<LogLevel, string>([
        [LogLevel.Info, ':white_check_mark:'],
        [LogLevel.Warning, ':warning:'],
        [LogLevel.Error, ':x:']
    ]);

    constructor() {
        super();
        this.handle = 'slack';
    }

    public initialize(options?: any) {
        this._client = new WebClient(process.env.SLACK_TOKEN);
        this._channel = process.env.ENVIRONMENT === 'production' ? '#jobs' : '#jobs-dev'
    }
    
    public async sendJob(scraperHandle: string, job: Job) {
        await this._client.chat.postMessage({
            channel: this._channel,
            text: `${job.house} - ${job.title}`,
            blocks: [{
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `${job.house} - ${job.title}`
                }
            }, {
                type: 'section',
                fields: [{
                    type: 'mrkdwn',
                    text: `*Title*\n${job.title}`
                }, {
                    type: 'mrkdwn',
                    text: `*House*\n${job.house}`
                }, {
                    type: 'mrkdwn',
                    text: `*Department*\n${job.department || '(no data)'}`
                }, {
                    type: 'mrkdwn',
                    text: `*Location*\n${job.location || '(no data)'}`
                }, {
                    type: 'mrkdwn',
                    text: `*Date*\n${job.date.toISOString().replace('T', ' ').substr(0, 19)}`
                }],
                accessory: {
                    type: 'image',
                    image_url: `${SlackReporter.BASE_URL}/${scraperHandle}.png`,
                    alt_text: scraperHandle
                }
            }, {
                type: 'actions',
                elements: [{
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: 'Open position :fire:'
                    },
                    url: job.link
                }]
            }]
        });
    }
    
    public async sendBulkJobs(scraperHandle: string, jobs: Job[]) {
        // TODO: get chunk size from settings
        for (const chunk of _.chunk(jobs, 20)) {
            const payload = {
                channel: this._channel,
                text: `${chunk[0].house} - Multiple positions!`,
                blocks: [{
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${chunk[0].house} - Multiple positions!`
                    }
                },{
                    type: 'section',
                    text: {
                        type: 'plain_text',
                        text: 'A shortened listing will be sent now, just waaait as seeecond...'
                    },
                    accessory: {
                        type: 'image',
                        image_url: `${SlackReporter.BASE_URL}/${scraperHandle}.png`,
                        alt_text: scraperHandle
                    }
                }]
            };
    
            for (const job of chunk) {
                payload.blocks.push({
                    type: 'section',
                    fields: [{
                        type: 'mrkdwn',
                        text: `<${job.link}|*${job.title}*>`
                    }, {
                        type: 'mrkdwn',
                        text: job.location || '(no data)'
                    }]
                } as any);

                payload.blocks.push({
                    type: 'divider'
                } as any);
            }
    
            await this._client.chat.postMessage(payload);
        }
    }

    public async sendLog(level: LogLevel, title: string, data?: string) {
        if (process.env.SILENT) return;

        const payload = {
            channel: '#jobs-logs',
            text: `${title}`,
            blocks: [{
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `${this._emojis.get(level)} ${title}`
                }
            }]
        };

        if (data) {
            payload.blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Additional data:*\n\`\`\`${data}\`\`\``
                }
            });
        }

        await this._client.chat.postMessage(payload);
    }
}
