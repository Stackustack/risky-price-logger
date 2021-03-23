## Description

App for logging products price changes in online shops.

## Installation

```bash
$ npm install
```

# Running the app locally
First of all copy `.env` file and fill it. 
```bash
cp .env.example .env
```

## a) ...using Docker-compose (recommended)
To start the app and Postgresql DB in Docker containers. By default Docker-compose stats app in watch mode.

```bash
# Run both containers based on docker-compose.yml
docker-compose up --build
```

## b) ...without docker, with localhost postgres DB
Make sure your local postgres is working fine.
Change `.env`:
```bash
HOST=localhost
```
 Then:
```bash
# development
$ npm run start

# OR in watch mode
$ npm run start:dev
```

## c) ...using Docker, with your local postgres DB
Can also use ur localhost postgres DB. First edit `.env`:
```bash
HOST=docker.for.mac.host.internal
```
And then:
```bash
# Build app image based on Dockerfile
docker build -t risky-price-logger:VERSION_TAG .
# Run it 
docker run -p 3000:3000 risky-price-logger:VERSION_TAG
```

## Test

```bash
# unit tests
$ npm run test
```

## Deployment

App setup on Heroku (from web dashboard or CLI)
- Add `Heroku Postgres DB` Addon and add env vars from Settings page.
- Normally after 30mins of idling app will go into sleep state. Wake up takes around 20-40secs. To not waste dyno freehours we're setting wakeup call around 3:00AM (otherwise cronjobs won't run). To omit that problem add `Heroku Scheduler`. Set it up to run once a day few minutes before your cron job (by default set it to 3:00AM, cronjob wil run at 3:03AM). Use following curl script to ping your app.
```
curl -s https://url-to-your-app.herokuapp.com/
```
- Add buildpacks for `heroku/nodejs` and `jontewks/puppeteer` (default Heroku servers doesn't have all dependencies to run puppeteer). Check more at [Puppeteer GitHub troubleshooting page](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-heroku).

Normally after 30mins of idling app will go into sleep state. Wake up takes around 20-40secs. To not waste dyno freehours we're setting wakeup call around 3:00AM (otherwise cronjobs won't run).

If you want to keep server from idling you can make calls every 20 minutes - but keep eye on your free hours.

## License

App is [MIT licensed](LICENSE).
