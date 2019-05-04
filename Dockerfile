FROM mhart/alpine-node:12

WORKDIR /usr/src/app/graphql

ENV FORCE_COLOR=1
ENV CI=true
ENV NODE_ENV=production

COPY dist .
COPY package.json package.json
COPY ecosystem.config.js ecosystem.config.js

RUN yarn install \
  --production \
  --network-timeout 1000000 \
  --ignore-optional --skip-integrity-check \
  --ignore-scripts \
  --ignore-engines && \
  yarn cache clean

EXPOSE 4000

RUN ls -la

CMD ["node", "index.js"]
# RUN yarn global add pm2
# CMD ["pm2-runtime", "ecosystem.config.js"]
