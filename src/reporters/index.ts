import { BaseReporter } from "./base-reporter";

import { SlackReporter } from "./slack";
import { DiscordReporter } from "./discord";

const repArray: BaseReporter[] = [
    new SlackReporter,
    new DiscordReporter
];

const reporters = {};
for (const rep of repArray) reporters[rep.handle] = rep;

export { reporters };
