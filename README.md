<h1 align="center">Gamejob Scrappie</h1>
<div align="center">
    Scraper manager collecting jobs in the game development industry
</div>
<div align="center">
    <img src="images/logo.png" width="256">
</div>

# What is Scrappie?
**Gamejob Scrappie** is a modular scraper manager that can accept multiple scrapers, deliver the collected openings through different routes and store them in different databases.

**Scrappie** is the result of laziness derived by scrolling long boring pages and wanting to go back to a *lovely* programming language that is TypeScript. The whole project is to be taken as exercise and not as a deliverable product, it can be prone to errors and it's intended **for personal use** only.

### What are the next steps with the project?
None. **Scrappie** is done for me, at least in the short term. I will keep maintaining it to run it for my personal amusement, but I didn't plan any new groundbreaking feature for the foreseeable future. If you need a feature, please feel free to clone, rewrite and experiment with this code, and if you feel it, you could also open a merge request.

# Features
- **Multiple scrapers in the same scan**: every different page is subdivided in its own file, but it's not bound to web pages: as long an array of `Job`s is returned, you can implement a scraper as you need.
- **Extensible reporters**: included in the project there are reporters for Slack and Discord, but you can create a new reporter for another platform (Telegram, e-mail, Twilio...).
- **Different databases**: Scrappie has a very rudimentary ORM system, you can create your own interface to a database of choices implementing half a dozen of functions.
- **"Smart" banlist**: if a scraper throw an error, that scraper is banned for a certain amount of time (determined in the configuration). This is useful to avoid multiple reports for the same error (website is down, etc.).
- **REST operation support**: you can write your own commands and operations and call them through an API endpoint, protected by Basic Auth.

# Usage

**Warning!** The app will crash without a proper configuration file (see below).

For production usage:
```bash
npm install
npm run build
npm start
```

Build the Docker image:
```bash
npm install
npm run docker:build
npm run docker:start
```

Run with [`nodemon`](https://www.npmjs.com/package/nodemon) for developemnt purposes:
```bash
npm install
npm run build
npm run dev
```

# Configuration

The configuration file is written in YAML: create a file called `scrappie-config.yml` in the root of the app, Here's an example:

```yaml
basic:
    interval: 3600000 # 1 hour
    banLength: 21600000 # 6 hours

scrapers:
    exclude: ['example']
    bulkThreshold: 10

api:
    port: 8080
    username: admin
    password: password

logos:
    enabled: true
    relativePath: '/../../logos'
    webRoot: '/logos'

databases:
    enabled: sqlite
    options:
        sqlite:
            filename: jobs.sqlite

reporters:
    enabled: slack
    options:
        slack:
            mainChannel: jobs
            logChannel: jobs-logs
            logosUrl: https://example.com/logos
            chunkSize: 20
        discord:
            mainChannel: jobs-dev
            logChannel: jobs-logs
            logosUrl: https://example.com/logos

```
## Scrappie configuration

- **`basic`**
    - `interval`: interval in seconds between a scan and the next one.
    - `banLength`: time a scraper stays banned and it will skipped during scan.
- **`scrapers`**
    - `exclude`: array of string containing the `handle`s of scrapers that will be excluded during the scan.
    - `bulkThreshold`: there are two different types of reports: the single one and the bulk one. If the current scraper returned more jobs than this value, the reporter will use the bulk message. This is useful if you encounter quota limiting (I had this problem with Slack).
- **`api`**
    - `port`: HTTP port to which the API server will listen.
    - `username`: username used by the Basic Auth to call the operations API.
    - `password`: password used by the Basic Auth to call the operations API.
- **`logos`**
    - `enabled`: enable the static hosting of the images used as logo in the job posting during reporting.
    - `relativePath`: path of the directory containing the images.
    - `webRoot`: base path of the URL for the images.
- **`databases`**:
    - `enabled`: `handle` of the database used by the app.
    - `options`: object containing the specific option for each database, using the `handle` as key. This option will be the argument of the `initialize` function.
- **`reporters`**
    - `enabled`: `handle` of the reporter used by the app.
    - `options`: object containing the specific option for each reporter, using the `handle` as key. This option will be the argument of the `initialize` function.

## SQLite specific configuration
- `filename`: file name of the SQLite file containing the database.

## Slack specific configuration
- `mainChannel`: channel used to send the job postings.
- `logChannel`: channel used to send logs (errors, infos, restarts...).
- `logosUrl`: URL with the base path of the logos.
- `chunkSize`: due to the size limit on a single message, the bulk message are divided in multiple chunks to stay inside the limits. This number is the number of postings per chunk.

**Warning!** On top of that, you have to set the `SLACK_TOKEN` environment variable to the access token to make the Slack API works.

## Discord specific configuration

- `mainChannel`: channel used to send the job postings.
- `logChannel`: channel used to send logs (errors, infos, restarts...).
- `logosUrl`: URL with the base path of the logos.

**Warning!** On top of that, you have to set the `DISCORD_TOKEN` environment variable to the access token to make the Discord API works.

# Operations API
You can call the operations sending a POST request to this URL:

```
http://[host]:[port]/operation
```

The request have to include the Basic Auth parameters, otherwise a `401` error will be returned.
The body is an `application/json` with this format:

```json
{
	"operation": "[operation handle]",
	"options": {
        // parameters passed to the operation
	}
}
```