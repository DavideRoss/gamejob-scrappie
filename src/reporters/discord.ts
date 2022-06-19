import { BaseReporter, LogLevel } from "./base-reporter";

import { Client, EmbedField, Intents, MessageEmbed, MessageOptions, TextChannel } from 'discord.js';
import { MessageComponentTypes } from "discord.js/typings/enums";

import * as _ from 'lodash';


export class DiscordReporter extends BaseReporter {
    // TODO: move to options
    private static BASE_URL: string = 'https://data.iamdavi.de/logos';

    private _client: Client;
    private _mainChannel: TextChannel;
    private _logChannel: TextChannel;
    
    private _emojis: Map<LogLevel, string> = new Map<LogLevel, string>([
        [LogLevel.Info, ':white_check_mark:'],
        [LogLevel.Warning, ':warning:'],
        [LogLevel.Error, ':x:']
    ]);

    private _colors: Map<LogLevel, string> = new Map<LogLevel, string>([
        [LogLevel.Info, '85ccff'],
        [LogLevel.Warning, 'ffd000'],
        [LogLevel.Error, 'c90f0c']
    ]);

    constructor() {
        super();
        this.handle = 'discord';
    }

    public async initialize(options?: any) {
        this._client = new Client({
            intents: [Intents.FLAGS.GUILDS]
        });

        return new Promise<void>((resolve, reject) => {
            this._client.login();
            this._client.once('error', reject);

            this._client.once('ready', () => {
                this._client.off('error', reject);

                this._mainChannel = this._client.channels.cache.find(v => (v as TextChannel).name === options.mainChannel) as TextChannel;
                this._logChannel = this._client.channels.cache.find(v => (v as TextChannel).name === options.logChannel) as TextChannel;

                resolve()
            });
        });
    }

    public async sendJob(scraperHandle: string, job: Job) {
        const msg: MessageOptions = {
            content: ' ',
            components: [{
                type: MessageComponentTypes.ACTION_ROW,
                components: [{
                    type: MessageComponentTypes.BUTTON,
                    style: 5,
                    label: 'Open position',
                    emoji: '🔥',
                    url: job.link
                }]
            }],

            embeds: [{
                title: `**${job.house} - ${job.title}**`,
                fields: [{
                    name: 'Title', value: job.title
                },{
                    name: 'House', value: job.house
                },{
                    name: 'Department', value: job.department || '(no data)'
                }, {
                    name: 'Location', value: job.location || '(no data)'
                }],
                thumbnail: {
                    url:  `${DiscordReporter.BASE_URL}/${scraperHandle}.png`,
                },
                timestamp: job.date.toISOString()
            }]
        };

        await this._mainChannel.send(msg);
    }

    public async sendBulkJobs(scraperHandle: string, jobs: Job[]) {
        const msg: MessageOptions = {
            content: ' ',
            embeds: [{
                title: `**${jobs[0].house} - Multiple positions!**`,
                thumbnail: {
                    url:  `${DiscordReporter.BASE_URL}/${scraperHandle}.png`,
                },
                timestamp: jobs[0].date.toISOString(),
                fields: jobs.map((job: Job) => ({
                    name: job.title, value: job.link
                }))
            }]
        };
        
        await this._mainChannel.send(msg);        
    }

    public async sendLog(level: LogLevel, title: string, data?: string | undefined) {
        if (process.env.SILENT) return;        

        const msg: MessageOptions = {
            content: ' ',
            embeds: [{
                color: parseInt(this._colors.get(level) || '000000', 16),
                title: `${this._emojis.get(level)} ${title}`,
                description: `\`\`\`\n${data}\n\`\`\``,
                timestamp: new Date().toISOString()
            }]
        };

        await this._logChannel.send(msg);
    }
}
