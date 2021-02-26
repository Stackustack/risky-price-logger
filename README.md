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



## License

App is [MIT licensed](LICENSE).
