import { BaseDatabase, DatabaseError } from "./base-database";

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class Sqlite extends BaseDatabase
{
    private db: any;

    constructor() {
        super();

        this.handle = 'sqlite',
        this.name = 'SQLite'
    }

    public async initialize(options?: any) {
        this.db = await open({
            filename: options.filename,
            driver: sqlite3.Database
        });

        await this.db.run(`CREATE TABLE IF NOT EXISTS "jobs" (
            "uuid" TEXT NOT NULL,
            "hash" TEXT NOT NULL,
            "scraperHandle" TEXT NOT NULL,
            "title" TEXT,
            "department" TEXT,
            "location" TEXT,
            "link" TEXT,
            "house" TEXT,
            "date" TEXT,
            PRIMARY KEY("uuid", "hash")
        )`);
    }

    public async findHash(hash: string): Promise<boolean> {
        const cnt = await this.db.get(`SELECT COUNT(*) AS count FROM main.jobs WHERE hash = '${hash}'`);
        return cnt.count > 0;
    }

    public async getHashes(company: string): Promise<string[]> {
        const hashes = await this.db.all(`SELECT hash FROM main.jobs WHERE scraperHandle = '${company}'`);
        return hashes.map(e => e.hash);
    }

    public async add(job: Job) {
        const query = `
            INSERT INTO main.jobs VALUES (
                "${job.uuid}",
                "${job.hash}",
                "${job.scraperHandle}",
                "${job.title}",
                "${job.department}",
                "${job.location}",
                "${job.link}",
                "${job.house}",
                "${job.date}"
            );
        `;

        await this.db.run(query);
    }

    public async addRange(jobs: Job[]) {
        if (jobs.length == 0) return;
        let query = 'INSERT INTO main.jobs VALUES ';
        const values: string[] = [];

        for (const job of jobs) values.push(`("${job.uuid}", "${job.hash}", "${job.scraperHandle}", "${job.title}", "${job.department}", "${job.location}", "${job.link}", "${job.house}", "${job.date}")`);
        query += values.join(', ') + ';';

        try {
            await this.db.run(query);
        } catch (e) {
            throw new DatabaseError('SQLite3 database error', {
                error: e,
                query,
                jobs
            });
        }
    }
}
