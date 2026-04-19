# got the node to run node image
FROM node:22-alpine

# install pnpm
RUN npm install -g pnpm

# determine folder to run the app
WORKDIR /usr/src/app

# copy package.json to the folder
COPY package.json pnpm-lock.yaml  ./

# install node_modules
RUN pnpm install --frozen-lockfile

# copy rest of files to the folder
COPY . .

RUN mkdir -p upload

RUN pnpm run build

CMD [ "pnpm","run","start:prod" ]