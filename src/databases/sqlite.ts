import { BaseDatabase, DatabaseError } from "./base-database";

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class Sqlite extends BaseDatabase
{
    // TODO: add this to options
    private static DB_NAME: string = 'jobs.sqlite';

    private _db: any;

    constructor() {
        super();

        this.handle = 'sqlite',
        this.name = 'SQLite'
    }

    public async initialize(options?: any) {
        this._db = await open({
            filename: Sqlite.DB_NAME,
            driver: sqlite3.Database
        });

        await this._db.run(`CREATE TABLE IF NOT EXISTS"jobs" (
            "uuid" TEXT NOT NULL,
            "hash" TEXT NOT NULL,
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
        const cnt = await this._db.get(`SELECT COUNT(*) AS count FROM main.jobs WHERE hash = '${hash}'`);
        return cnt.count > 0;
    }

    public async add(job: Job) {
        const query = `
            INSERT INTO main.jobs VALUES (
                "${job.uuid}",
                "${job.hash}",
                "${job.title}",
                "${job.department}",
                "${job.location}",
                "${job.link}",
                "${job.house}",
                "${job.date}"
            );
        `;

        await this._db.run(query);
    }

    public async addRange(jobs: Job[]) {
        if (jobs.length == 0) return;
        let query = 'INSERT INTO main.jobs VALUES ';
        const values: string[] = [];

        for (const job of jobs) values.push(`("${job.uuid}", "${job.hash}", "${job.title}", "${job.department}", "${job.location}", "${job.link}", "${job.house}", "${job.date}")`);
        query += values.join(', ') + ';';

        try {
            await this._db.run(query);
        } catch (e) {
            throw new DatabaseError('SQLite3 database error', {
                error: e,
                query,
                jobs
            });
        }
    }
}
