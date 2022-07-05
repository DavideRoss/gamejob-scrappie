import { BaseReporter, LogLevel } from "./base-reporter";

import { WebClient } from "@slack/web-api";
import * as _ from 'lodash';

export class SlackReporter extends BaseReporter {
    private client: WebClient;
    private mainChannel: string;
    private logChannel: string;

    private logosUrl: string;
    private chunkSize: number;

    private emojis: Map<LogLevel, string> = new Map<LogLevel, string>([
        [LogLevel.Info, ':white_check_mark:'],
        [LogLevel.Warning, ':warning:'],
        [LogLevel.Error, ':x:']
    ]);

    constructor() {
        super();
        this.handle = 'slack';
    }

    public initialize(options?: any) {
        this.client = new WebClient(process.env.SLACK_TOKEN);
        this.mainChannel = process.env.ENVIRONMENT === 'production' ? options.mainChannel : '#jobs-dev';
        this.logChannel = options.logChannel;

        this.logosUrl = options.logosUrl;
        this.chunkSize = options.chunkSize;
    }
    
    public async sendJob(scraperHandle: string, job: Job) {
        await this.client.chat.postMessage({
            channel: this.mainChannel,
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
                    image_url: `${this.logosUrl}/${scraperHandle}.png`,
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
        for (const chunk of _.chunk(jobs, this.chunkSize)) {
            const payload = {
                channel: this.mainChannel,
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
                        image_url: `${this.logosUrl}/${scraperHandle}.png`,
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
    
            await this.client.chat.postMessage(payload);
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
                    text: `${this.emojis.get(level)} ${title}`
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

        await this.client.chat.postMessage(payload);
    }
}
