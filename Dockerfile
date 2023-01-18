FROM node:18
USER root
WORKDIR /myfolder/

RUN apt-get update
RUN apt-get install chromium -y

# RUN apt-get install xvfb -y
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY ./package.json /myfolder/
COPY ./package-lock.json /myfolder/
RUN yarn

COPY . /myfolder/

CMD yarn start:dev