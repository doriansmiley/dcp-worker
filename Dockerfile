FROM node:dubnium

MAINTAINER Dorian Smiley, doriansmiley@siliconpublishing.com

RUN mkdir -p /usr/src/dcp-worker
WORKDIR /usr/src/dcp-worker

COPY package.json /usr/src/dcp-worker/
COPY index.js /usr/src/dcp-worker
COPY start.sh /usr/src/dcp-worker
RUN npm install --no-cache
ENTRYPOINT ["sh", "/usr/src/dcp-worker/start.sh"]


