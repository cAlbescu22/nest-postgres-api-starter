FROM node:16-alpine3.15

COPY . /api

WORKDIR /api

RUN apk update && \
 npm install && \
 npm run build

EXPOSE 8080

CMD ["./docker-entrypoint.sh"]
