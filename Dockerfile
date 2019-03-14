FROM node:8-slim

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN set -ex \
	&& mkdir -p /data/app \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends git python make g++

ADD app /data/app

COPY package.json yarn.lock nuxt.config.js postcss.config.js tailwind.js /data/

WORKDIR /data

RUN yarn install \
	&& yarn build \
	&& apt-get purge -y git python make g++ \
	&& apt-get autoremove -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists /var/log /usr/share/man /tmp /var/tmp

ENV HOST 0.0.0.0
EXPOSE 80

CMD ["yarn","start"]