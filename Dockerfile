FROM node:10-slim
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.16.0
ENV HOST=0.0.0.0 \
	PORT=80 

RUN set -ex \
	&& mkdir -p /data/app \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends git python make g++
ADD app /data/app
COPY package.json yarn.lock  nuxt.config.js /data/
WORKDIR /data
RUN yarn install \
	&& yarn build \
	&& apt-get purge -y git python make g++ \
	&& apt-get autoremove -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists /var/log /usr/share/man /tmp /var/tmp

CMD ["yarn","start"]