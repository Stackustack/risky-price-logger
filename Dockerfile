FROM node:14-slim
ENV APP_NAME=/risky-price-logger
WORKDIR $APP_NAME

# Install PS since I'm using node12:slim, which doesn't contain PS, https://github.com/nestjs/nest-cli/issues/484
RUN apt-get update && apt-get install -y procps


# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm install
COPY . /risky-price-logger/

EXPOSE 3000

CMD ["npm", "run", "start:dev"]