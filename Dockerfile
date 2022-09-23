FROM node:16.13.0 AS builder
WORKDIR /builder
WORKDIR /builder/dsbd-web-admin
COPY . ./
RUN npm install
RUN npm run build-prod

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /builder/dsbd-web-admin/build ./
