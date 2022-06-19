import { BaseDatabase } from "./base-database";

import { Sqlite } from "./sqlite";

const dbArray: BaseDatabase[] = [
    new Sqlite,
];

const databases = {};
for (const db of dbArray) databases[db.handle] = db;

export { databases };