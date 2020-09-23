FROM node:10
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.5
ENV HOST=0.0.0.0 \
	PORT=80 

ENV GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID

RUN set -ex \
	&& mkdir -p /data/app 

ADD app /data/app
COPY package.json yarn.lock  nuxt.config.js /data/
WORKDIR /data
RUN yarn install \
	&& yarn build 

CMD ["yarn","start"]