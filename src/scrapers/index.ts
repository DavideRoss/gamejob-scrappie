import { ActivisionScraper } from "./activision";
import { AvalancheScraper } from "./avalanche";
import { BaseScraper } from "./base-scraper";
import { BlizzardScraper } from "./blizzard";
import { BungieScraper } from "./bungie";
import { CDProjektScraper } from "./cd-projekt";
import { CreativeAssemblyScraper } from "./creative-assembly";
import { FrontierScraper } from "./frontier";
import { GameloftScraper } from "./gameloft";
import { GuerrillaScraper } from "./guerrilla";
import { MassiveScraper } from "./massive";
import { MediatonicScraper } from "./mediatonic";
import { MiniclipScraper } from "./miniclip";
import { NaughtyDogScraper } from "./naughty-dog";
import { ParadoxScraper } from "./paradox";
import { RiotScrape } from "./riot";
import { RockstarScraper } from "./rockstar";
import { SplashDamageScraper } from "./splash-damage";
import { UbisoftScraper } from "./ubisoft";
import { WargamingScraper } from "./wargaming";

const scrapers: BaseScraper[] = [
    new ActivisionScraper,
    new AvalancheScraper,
    new BlizzardScraper,
    new BungieScraper,
    new CDProjektScraper,
    new CreativeAssemblyScraper,
    new FrontierScraper,
    new GameloftScraper,
    new GuerrillaScraper,
    new MassiveScraper,
    new MediatonicScraper,
    new MiniclipScraper,
    new NaughtyDogScraper,
    new ParadoxScraper,
    new RiotScrape,
    new RockstarScraper,
    new SplashDamageScraper,
    new UbisoftScraper,
    new WargamingScraper
];

export { scrapers };
