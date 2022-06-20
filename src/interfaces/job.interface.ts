interface Job {
    uuid: string;
    hash: string;
    scraperHandle: string;
    title: string;
    house: string;
    department?: string;
    link: string;
    location?: string;
    date: Date
}