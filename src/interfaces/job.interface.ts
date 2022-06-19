interface Job {
    uuid: string;
    hash: string;
    title: string;
    house: string;
    department?: string;
    link: string;
    location?: string;
    date: Date
}