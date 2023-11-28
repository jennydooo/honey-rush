FROM node

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 8000

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["yarn", "dev"]
