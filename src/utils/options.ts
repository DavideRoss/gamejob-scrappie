import { promises as fs } from 'fs';

import * as dotenv from 'dotenv';
import minimist from 'minimist';
import YAML from 'yaml';

export class Options {
    public static argv: any;

    public static async initalize() {
        dotenv.config();
        Options.argv = minimist(process.argv.slice(2));

        const raw = await fs.readFile('./scrappie-config.yml', 'utf8');    
        const data = YAML.parse(raw);
        for (const k in data) Options[k] = data[k];
    }
}
